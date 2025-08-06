import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  LinearProgress,
  Avatar,
  Button,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import Webcam from "react-webcam";
import GlobalButton from "../../../components/ui/button";
import { useSubmitSelfieMutation } from "../services/gameArena.Api";

interface SelfieUploadScreenProps {
  data: {
    currentGuessId: string;
    lastGuessPlayerPhoto?: string;
    lastGuessPlayerName?: string;
  };
  progressValue: number;
  onSelfieUploaded: () => void;
}

const SelfieUploadScreen: React.FC<SelfieUploadScreenProps> = ({
  data,
  progressValue,
  onSelfieUploaded,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitSelfie] = useSubmitSelfieMutation();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCapturedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (capturedImage && capturedImage.startsWith("blob:")) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  const handleConfirm = async () => {
    if (!capturedImage || !data.currentGuessId) return;

    setIsUploading(true);
    try {
      // Convert base64 to File object
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], "selfie.jpg", {
        type: "image/jpeg",
      });

      // Create FormData
      const formData = new FormData();
      formData.append("guessId", data.currentGuessId);
      formData.append("selfie", file);

      await submitSelfie(formData).unwrap();

      console.log("Selfie uploaded successfully");
      onSelfieUploaded();
    } catch (error) {
      console.error("Error uploading selfie:", error);
      // You might want to show an error message here
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          borderRadius: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h3"
            sx={{
              mx: "auto",
              textAlign: "center",
            }}
          >
            GetSetKnow!
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: "100%",
          height: "6px",
          zIndex: 1000,
          display: "flex",
          p: 0,
          alignItems: "center",
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            width: "100%",
            height: 6,
            borderRadius: 0,
            backgroundColor: "#78788029",
            "& .MuiLinearProgress-bar": {
              borderRadius: 0,
              backgroundColor: "secondary.main",
            },
          }}
        />
      </Box>

      {/* Top Section - Player Info */}
      <Box
        sx={{
          bgcolor: "primary.main",
          height: "18vh",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          gap: 2,
        }}
      >
        {data.lastGuessPlayerPhoto ? (
          <Avatar
            src={data.lastGuessPlayerPhoto}
            sx={{
              width: 80,
              height: 80,
              border: "3px solid white",
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: 80,
              height: 80,
              border: "3px solid white",
              backgroundColor: "secondary.main",
              fontSize: "2rem",
            }}
          >
            {data.lastGuessPlayerName?.charAt(0) || "?"}
          </Avatar>
        )}
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: "white",
              textAlign: "center",
              mb: 1,
              fontWeight: 600,
            }}
          >
            Great! You found {data.lastGuessPlayerName?.split(" ")[0]}!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "white",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            Now take a selfie with <br />
            {data.lastGuessPlayerName?.split(" ")[0]} to continue!
          </Typography>
        </Box>
      </Box>

      {/* Main Content Container */}
      <Box
        sx={{
          maxWidth: "400px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -30%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* White Card Container */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            p: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Camera/Image Container */}
          <Box
            sx={{
              width: 300,
              height: 300,
              bgcolor: "black",
              borderRadius: 2,
              mb: 3,
              overflow: "hidden",
              border: "2px solid #f0f0f0",
            }}
          >
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured Selfie"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={300}
                height={300}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Bottom Controls */}
      <Box
        sx={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 1,
        }}
      >
        {/* Buttons */}
        <Box sx={{ width: "100%", px: "20px" }}>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />

          {capturedImage ? (
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <Button
                onClick={handleRetake}
                disabled={isUploading}
                variant="outlined"
                sx={{
                  whiteSpace: "nowrap",
                  width: "100%",
                  backgroundColor: "transparent",
                  borderColor: "black",
                  padding: "8px 16px",
                  minWidth: "100px",
                  borderRadius: "4px",
                  cursor: isUploading ? "not-allowed" : "pointer",
                  textTransform: "none",
                }}
              >
                Retake
              </Button>
              <GlobalButton
                onClick={handleConfirm}
                disabled={isUploading}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  textWrap: "nowrap",
                }}
              >
                {isUploading ? "Uploading..." : "Continue"}
              </GlobalButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <Button
                onClick={capture}
                variant="outlined"
                fullWidth
                sx={{
                  textWrap: "nowrap",
                  backgroundColor: "transparent",
                  color: "black",
                  border: "1px solid black",
                  "&:hover": {
                    backgroundColor: "transparent",
                    borderColor: "black",
                  },
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Capture Selfie
              </Button>
              <GlobalButton
                onClick={handleUploadClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  textWrap: "nowrap",
                }}
              >
                <CloudUpload sx={{ fontSize: 16 }} />
                Upload Photo
              </GlobalButton>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SelfieUploadScreen;
