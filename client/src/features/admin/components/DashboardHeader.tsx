import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DashboardHeaderProps } from "../types/interfaces";
import { useAdminAuth } from "../services/useAdminAuth";
import LogoutIcon from "@mui/icons-material/Logout";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import DownloadIcon from "@mui/icons-material/Download";
import SettingsIcon from "@mui/icons-material/Settings";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import ManageQuestionsModal from "./ManageQuestionsModal";
import ManageBrandingModal from "./ManageBrandingModal";
import ManageTeamsModal from "./ManageTeamsModal";
import GroupIcon from "@mui/icons-material/Group";
import { useGetSessionQuery } from "../../game/services/gameArena.Api";
import {
  useAdminLogoutMutation,
  useDownloadSessionSelfiesMutation,
  useUpdateSessionMutation,
} from "../services/admin.Api";
import GlobalButton from "../../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../../app/rootReducer";
import { RootState } from "../../../app/store";
import { clearAdmin } from "../services/adminSlice";

// Dashboard Header Component
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  data,
  onGameStatusChange,
  onTransactionsChange,
  transaction = false, // Default value for transaction
  isCheckingReadiness = false, // Default value for checking readiness
}) => {
  const [AdminLogout] = useAdminLogoutMutation();
  const [downloadSessionSelfies] = useDownloadSessionSelfiesMutation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [brandingModalOpen, setBrandingModalOpen] = useState(false);
  const [teamsModalOpen, setTeamsModalOpen] = useState(false);
  const [pauseConfirmOpen, setPauseConfirmOpen] = useState(false);
  const [resumeConfirmOpen, setResumeConfirmOpen] = useState(false);
  const [startConfirmOpen, setStartConfirmOpen] = useState(false);
  const [UpdateSession, { isLoading: isUpdatingSession }] = useUpdateSessionMutation();
  const { admin } = useAdminAuth();
  const navigate = useNavigate();
  const { sessionId } = useAppSelector((state: RootState) => state.game);
  const dispatch = useAppDispatch();
  const { data: session } = useGetSessionQuery(sessionId || "", { skip: !sessionId });

  const handleLogout = () => {
    AdminLogout({})
      .unwrap()
      .then(() => {
        navigate(`/admin/${sessionId}/login`);
        dispatch(clearAdmin());
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };
  // const handleSesssionEnd = () => {
  //   UpdateSession({ status: "ended" })
  //     .unwrap()
  //     .then(() => {
  //       navigate(`/admin/${sessionId}/login`);
  //       dispatch(clearAdmin());
  //     })
  //     .catch((error) => {
  //       console.error("Failed to end session:", error);
  //     });
  // };

  const handleViewLeaderboard = () => {
    navigate(`/admin/${sessionId}/leaderboard`);
  };

  const handleDownloadSelfies = async () => {
    if (!sessionId) return;
    
    setIsDownloading(true);
    try {
      const blob = await downloadSessionSelfies(sessionId).unwrap();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `session-${sessionId}-selfies-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Failed to download selfies:', error);
      alert(error?.data?.message || 'Failed to download session data. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={4}
        py={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Admin Dashboard
        </Typography>

        <Box display="flex" gap={2} alignItems="center">
          <Button
            variant="outlined"
            color="success"
            startIcon={isDownloading ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={handleDownloadSelfies}
            disabled={isDownloading}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 500,
            }}
          >
            <Box
              sx={{
                display: { xs: "none", sm: "inline" },
              }}
            >
              {isDownloading ? 'Downloading...' : 'Download Data'}
            </Box>
          </Button>

          {data?.gameStatus === "pending" && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<GroupIcon />}
              onClick={() => setTeamsModalOpen(true)}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 500,
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", sm: "inline" },
                }}
              >
                Manage Teams
              </Box>
            </Button>
          )}

          <Button
            variant="outlined"
            color="primary"
            startIcon={<SettingsIcon />}
            onClick={() => setQuestionsModalOpen(true)}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 500,
            }}
          >
            <Box
              sx={{
                display: { xs: "none", sm: "inline" },
              }}
            >
              Customize Questions
            </Box>
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<LeaderboardIcon />}
            onClick={handleViewLeaderboard}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 500,
            }}
          >
            <Box
              sx={{
                display: { xs: "none", sm: "inline" },
              }}
            >
              Leaderboard
            </Box>
          </Button>

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
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          px: 4,
          mb: 2,
        }}
      >
        {/* Left Card: Admin Info / Controls */}
        <Paper
          sx={{
            flex: 1,
            p: 3,
            backgroundColor: "rgba(252, 166, 30, 0.10)",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: "16px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
              flex: 1,
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              color="black"
              textAlign={"center"}
            >
              Admin Name - {admin?.name || data?.adminName || "Admin"}
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
            {data?.gameStatus !== "ended" && (
              <GlobalButton
                fullWidth={false}
                disabled={isCheckingReadiness || isUpdatingSession}
                onClick={() => {
                  if (data?.gameStatus === "playing") {
                    setPauseConfirmOpen(true);
                  } else if (data?.gameStatus === "paused") {
                    setResumeConfirmOpen(true);
                  } else {
                    setStartConfirmOpen(true);
                  }
                }}
              >
                {isCheckingReadiness
                  ? "Checking Players..."
                  : data?.gameStatus === "playing"
                  ? "Pause Game"
                  : data?.gameStatus === "paused"
                  ? "Resume Game"
                  : "Start Game"}
              </GlobalButton>
            )}

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

        {/* Right Card: Session Branding */}
        <Paper
          sx={{
            p: 3,
            width: { xs: "100%", md: "460px" },
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
            backgroundColor: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold" color="#1F2937" style={{ fontSize: "20px" }}>
              Session Branding
            </Typography>
            <IconButton size="small" onClick={() => setBrandingModalOpen(true)} sx={{ color: "#6B7280" }}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box display="flex" alignItems="center" gap={3} sx={{ mt: 1 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "16px",
                backgroundColor: session?.companyLogo?.location ? "#F3F4F6" : "#3622C9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "1px solid #E5E7EB",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              {session?.companyLogo?.location ? (
                <img
                  src={session.companyLogo.location}
                  alt="Company Logo"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <BusinessIcon sx={{ color: "#FFFFFF", fontSize: 40 }} />
              )}
            </Box>

            <Box>
              <Typography
                variant="caption"
                fontWeight="bold"
                color="#9CA3AF"
                sx={{ letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "11px" }}
              >
                Company Name
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="#1F2937" sx={{ mt: 0.5, fontSize: "22px" }}>
                {session?.companyName || "GetSetKnow!"}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      <ManageQuestionsModal
        open={questionsModalOpen}
        onClose={() => setQuestionsModalOpen(false)}
        gameStatus={data?.gameStatus || "pending"}
      />
      <ManageBrandingModal
        open={brandingModalOpen}
        onClose={() => setBrandingModalOpen(false)}
      />
      <ManageTeamsModal
        open={teamsModalOpen}
        onClose={() => setTeamsModalOpen(false)}
        gameStatus={data?.gameStatus || "pending"}
      />

      {/* Pause Confirmation Dialog */}
      <Dialog open={pauseConfirmOpen} onClose={() => setPauseConfirmOpen(false)}>
        <DialogTitle>Confirm Pause Game</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to pause the game? Players will not be able to answer or guess while the game is paused.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setPauseConfirmOpen(false)} variant="outlined" color="primary" sx={{ textTransform: "none", borderRadius: "8px" }}>Cancel</Button>
          <Button
            onClick={async () => {
              setPauseConfirmOpen(false);
              try {
                await UpdateSession({ status: "paused" }).unwrap();
              } catch (err) {
                console.error("Failed to pause session:", err);
              }
            }}
            color="primary"
            variant="contained"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Pause
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resume Confirmation Dialog */}
      <Dialog open={resumeConfirmOpen} onClose={() => setResumeConfirmOpen(false)}>
        <DialogTitle>Confirm Resume Game</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to resume the game?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setResumeConfirmOpen(false)} variant="outlined" color="primary" sx={{ textTransform: "none", borderRadius: "8px" }}>Cancel</Button>
          <Button
            onClick={async () => {
              setResumeConfirmOpen(false);
              try {
                await UpdateSession({ status: "playing" }).unwrap();
              } catch (err) {
                console.error("Failed to resume session:", err);
              }
            }}
            color="primary"
            variant="contained"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Resume
          </Button>
        </DialogActions>
      </Dialog>

      {/* Start Confirmation Dialog */}
      <Dialog open={startConfirmOpen} onClose={() => setStartConfirmOpen(false)}>
        <DialogTitle>Confirm Start Game</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to start the game?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setStartConfirmOpen(false)} variant="outlined" color="primary" sx={{ textTransform: "none", borderRadius: "8px" }}>Cancel</Button>
          <Button
            onClick={() => {
              setStartConfirmOpen(false);
              if (onGameStatusChange) onGameStatusChange();
            }}
            color="primary"
            variant="contained"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Start
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DashboardHeader;
