import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
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
          p: 3,
          mb: 3,
          backgroundColor: "rgba(167, 139, 250, 0.05)",
          borderRadius: 0,
          borderBottom: "1px solid rgba(167, 139, 250, 0.1)",
          boxShadow: "none",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          flexWrap="wrap"
          gap={2}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToDashboard}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 500,
            }}
          >
            Back to Dashboard
          </Button>

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
                borderRadius: "20px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#10B981",
                  animation: "pulse 1.5s infinite",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(0.8)", opacity: 0.5 },
                    "50%": { transform: "scale(1.2)", opacity: 1 },
                    "100%": { transform: "scale(0.8)", opacity: 0.5 },
                  },
                }}
              />
              <Typography variant="body2" fontWeight="bold" sx={{ color: "text.secondary" }}>
                Connections Established:{" "}
                <Typography component="span" fontWeight="bold" sx={{ color: "text.primary" }}>
                  {data.connectionsCount}
                </Typography>
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={2}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "16px",
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
            textAlign="left"
          >
            {session?.companyName || "Game Leaderboard"}
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ px: 4, pb: 4 }}>
        {/* Side by side layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 2fr",
              lg: "1fr 2.5fr",
            },
            gap: {
              xs: 3,
              md: 4,
              lg: 5,
            },
            alignItems: "start",
          }}
        >
          {/* Player Leaderboard Section - Left */}
          <Box>
            <PlayerLeaderboard playerRankings={data.playerRankings} />
          </Box>

          {/* Selfies Gallery Section - Right */}
          <Box>
            <SelfiesGallery selfies={data.selfies} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Leaderboard;
