import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetSessionQuery } from "../../game/services/gameArena.Api";
import { useUpdateBrandingMutation } from "../services/admin.Api";
import { useAppSelector } from "../../../app/rootReducer";
import { RootState } from "../../../app/store";

interface ManageBrandingModalProps {
  open: boolean;
  onClose: () => void;
}

const ManageBrandingModal: React.FC<ManageBrandingModalProps> = ({
  open,
  onClose,
}) => {
  const { sessionId } = useAppSelector((state: RootState) => state.game);
  const { data: session, refetch: refetchSession } = useGetSessionQuery(sessionId || "", { skip: !open || !sessionId });
  const [updateBranding, { isLoading: isUpdating }] = useUpdateBrandingMutation();

  const [companyName, setCompanyName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize values when session is fetched
  useEffect(() => {
    if (session) {
      setCompanyName(session.companyName || "");
      setPreviewUrl(session.companyLogo?.location || null);
    }
  }, [session, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMsg("File size must be less than 5MB");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearLogo = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("companyName", companyName.trim());
    
    if (selectedFile) {
      formData.append("companyLogo", selectedFile);
    }

    try {
      await updateBranding(formData).unwrap();
      setSuccessMsg("Branding updated successfully!");
      refetchSession();
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error("Failed to update branding:", err);
      setErrorMsg(err?.data?.message || "Failed to update branding settings.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Session Branding
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={isUpdating}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Configure branding for this session. The company name and logo will be displayed on the player login page and game headers.
        </Typography>

        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Company Name"
            variant="outlined"
            fullWidth
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={isUpdating}
            placeholder="e.g. Acme Corp"
            slotProps={{
              htmlInput: { maxLength: 40 }
            }}
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "medium" }}>
              Company Logo (Max 5MB)
            </Typography>
            
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: isUpdating ? "default" : "pointer",
                backgroundColor: "#f9f9f9",
                "&:hover": {
                  borderColor: isUpdating ? "#ccc" : "primary.main",
                  backgroundColor: isUpdating ? "#f9f9f9" : "#f5f5f5",
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
              onClick={() => {
                if (!isUpdating) fileInputRef.current?.click();
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUpdating}
              />

              {previewUrl ? (
                <Box
                  sx={{
                    position: "relative",
                    width: 120,
                    height: 120,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent triggering file select
                >
                  <img
                    src={previewUrl}
                    alt="Company logo preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                  {!isUpdating && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(255,0,0,0.1)",
                          color: "error.main",
                        },
                      }}
                      size="small"
                      onClick={handleClearLogo}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ) : (
                <>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.light" }}>
                    <PhotoCameraIcon sx={{ fontSize: 28, color: "#fff" }} />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    Drag and drop or click to upload your company logo
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" disabled={isUpdating}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          disabled={isUpdating || (!companyName.trim() && !selectedFile)}
          startIcon={isUpdating && <CircularProgress size={16} color="inherit" />}
        >
          {isUpdating ? "Saving..." : "Save Branding"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageBrandingModal;
