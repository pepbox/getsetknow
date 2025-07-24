import React from "react";
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
} from "@mui/material";
import { DashboardHeaderProps } from "../types/interfaces";
import LogoutIcon from "@mui/icons-material/Logout";

// Dashboard Header Component
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  data,
  gameStatus,
  onGameStatusChange,
  onTransactionsChange,
}) => {
  const handleLogout = () => {
    // implement logout logic here
    console.log("Logging out...");
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
            Admin Name - {data.adminName}
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
          <FormControlLabel
            control={
              <Switch
                checked={gameStatus}
                onChange={() => {
                  if (onGameStatusChange) onGameStatusChange();
                }}
                color="success"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Game Status
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={data.enableTransactions}
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
