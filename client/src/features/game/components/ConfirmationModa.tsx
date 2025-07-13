import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import GlobalButton from "../../../components/ui/button";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  topText?: string;
  mainText: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  topText,
  mainText,
  primaryButtonText = "Submit",
  secondaryButtonText = "Cancel",
  onPrimaryClick,
  onSecondaryClick,
  primaryButtonDisabled = false,
  secondaryButtonDisabled = false,
}) => {
  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    }
    onClose();
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={false}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            margin: 2,
            minHeight: "auto",
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        },
      }}
    >
      <DialogContent
        sx={{
          padding: "24px",
          textAlign: "center",
          minHeight: "120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {topText && (
          <Typography
            variant="body2"
            sx={{
              color: "#FF6B6B",
              marginBottom: "16px",
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            {topText}
          </Typography>
        )}

        <Typography
          variant="h6"
          sx={{
            color: "#333333",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: 1.4,
            marginBottom: "8px",
          }}
        >
          {mainText}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          padding: "16px 24px 24px 24px",
          gap: "12px",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <GlobalButton
          onClick={handleSecondaryClick}
          disabled={secondaryButtonDisabled}
          fullWidth={false}
          sx={{
            minWidth: "100px",
            backgroundColor: "#ffffff",
            color: "#333333 !important",
            border: "1px solid #E0E0E0",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
            "&:disabled": {
              backgroundColor: "#f5f5f5",
              color: "#999999 !important",
            },
          }}
        >
          {secondaryButtonText}
        </GlobalButton>

        <GlobalButton
          onClick={handlePrimaryClick}
          disabled={primaryButtonDisabled}
          fullWidth={false}
          sx={{
            minWidth: "100px",
            backgroundColor: "#4ECDC4",
            "&:hover": {
              backgroundColor: "#45B7B8",
            },
          }}
        >
          {primaryButtonText}
        </GlobalButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
