import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayerLeaderboard from "./PlayerLeaderboard";
import SelfiesGallery from "./SelfiesGallery";
import { LeaderboardProps } from "../types/interfaces";
import { useAppSelector } from "../../../app/rootReducer";
import { RootState } from "../../../app/store";
import Loader from "../../../components/ui/Loader";
import { useGetSessionQuery } from "../../game/services/gameArena.Api";
import defaultLogo from "../../../assets/Get-Set-Know.webp";

const Leaderboard: React.FC<LeaderboardProps> = ({ data, isLoading }) => {
  const navigate = useNavigate();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(true);
  const { sessionId } = useAppSelector((state: RootState) => state.game);
  const { data: session } = useGetSessionQuery(sessionId || "", { skip: !sessionId });

  const handleBackToDashboard = () => {
    navigate(`/admin/${sessionId}/dashboard`);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return (
      <Box sx={{ p: 4, textAlign: "center", my:"auto"}}>
        <Typography variant="h6" color="error">
          Failed to load leaderboard data
        </Typography>
        <Button
          variant="contained"
          onClick={handleBackToDashboard}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          backgroundColor: "rgba(167, 139, 250, 0.05)",
          borderRadius: 0,
          borderBottom: "1px solid rgba(167, 139, 250, 0.1)",
          boxShadow: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: { xs: "wrap", md: "nowrap" },
            width: "100%",
          }}
        >
          {/* Left: Back button (taking up left third on md+) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: "auto", md: "25%" },
              justifyContent: "flex-start",
            }}
          >
            <IconButton
              onClick={handleBackToDashboard}
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                p: 1.25,
                color: "text.primary",
                backgroundColor: "#ffffff",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "rgba(167, 139, 250, 0.04)",
                },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Center: Logo + Title (centered horizontally on md+) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              flexGrow: 1,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
                borderRadius: "12px",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "1px solid #E5E7EB",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <img
                src={session?.companyLogo?.location || defaultLogo}
                alt="Session Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>

            <Typography
              variant="h3"
              fontWeight="bold"
              color="black"
              sx={{
                fontSize: { xs: "1.5rem", sm: "1.875rem", md: "2.25rem" },
              }}
            >
              {session?.companyName || "Game Leaderboard"}
            </Typography>
          </Box>

          {/* Right: Connections Established (taking up right third on md+) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: "auto", md: "25%" },
              justifyContent: "flex-end",
              flexShrink: 0,
            }}
          >
            {data.connectionsCount !== undefined && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  color: "text.primary",
                  px: 2,
                  py: 0.75,
                  borderRadius: "12px",
                  width: "fit-content",
                }}
              >
                <Typography variant="body2" fontWeight="bold" sx={{ color: "text.secondary", fontSize: "16px", whiteSpace: "nowrap" }}>
                  Connections:{" "}
                  <Typography component="span" fontWeight="bold" sx={{ color: "text.primary", fontSize: "20px" }}>
                    {data.connectionsCount}
                  </Typography>
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      <Box sx={{ px: { xs: 2, sm: 4 }, pb: 4 }}>
        {/* Side by side layout or single full-width layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isLeaderboardOpen
              ? {
                  xs: "1fr",
                  md: "1fr 2fr",
                  lg: "1fr 2.5fr",
                }
              : "1fr",
            gap: {
              xs: 3,
              md: 4,
              lg: 5,
            },
            alignItems: "start",
          }}
        >
          {/* Player Leaderboard Section - Left */}
          {isLeaderboardOpen && (
            <Box>
              <PlayerLeaderboard 
                playerRankings={data.playerRankings} 
                onClose={() => setIsLeaderboardOpen(false)}
              />
            </Box>
          )}

          {/* Selfies Gallery Section - Right */}
          <Box>
            <SelfiesGallery 
              selfies={data.selfies} 
              isLeaderboardOpen={isLeaderboardOpen}
              onToggleLeaderboard={() => setIsLeaderboardOpen(true)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Leaderboard;
