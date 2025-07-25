import React from "react";
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DashboardHeaderProps } from "../types/interfaces";
import { useAdminAuth } from "../services/useAdminAuth";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUpdateSessionMutation } from "../services/admin.Api";

// Dashboard Header Component
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  data,
  onGameStatusChange,
  onTransactionsChange,
  transaction = false, // Default value for transaction
}) => {
  const [UpdateSession] = useUpdateSessionMutation();
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };
  const handleSesssionEnd = () => {
    UpdateSession({ status: "ended" })
      .unwrap()
      .then(() => {
        logout();
        navigate("/admin/login");
      })
      .catch((error) => {
        console.error("Failed to end session:", error);
      });
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={10}
        py={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Admin Dashboard
        </Typography>

        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            border: "1px solid #FF6363",
            fontWeight: 500,
            color: "#FF6363",
          }}
        >
          <Box
            sx={{
              display: { xs: "none", sm: "inline" },
            }}
          >
            Log Out
          </Box>
        </Button>
      </Box>
      <Paper
        sx={{
          p: 3,
          px: 10,
          mb: 2,
          backgroundColor: "rgba(252, 166, 30, 0.10)",
          dropShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            color="black"
            textAlign={"center"}
          >
            Admin Name - {admin?.name || data.adminName || "Admin"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="inherit" 
            sx={{
              display: data?.gameStatus === "playing" ? "none" : "block",
              justifySelf: "flex-end",
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#222",
              },
            }}
            onClick={() => {
              if (onGameStatusChange) onGameStatusChange();
            }}
          >
            Start Game
          </Button>

          <Button
            variant="contained"
            color="inherit"
            sx={{
              justifySelf: "flex-end",
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#222",
              },
            }}
            onClick={() => {
              handleSesssionEnd();
            }}
          >
            End Session
          </Button>
          <FormControlLabel
            control={
              <Switch
                checked={transaction}
                onChange={(e) => onTransactionsChange?.(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Enable Transactions
              </Typography>
            }
          />
        </Box>
      </Paper>
    </>
  );
};

export default DashboardHeader;
