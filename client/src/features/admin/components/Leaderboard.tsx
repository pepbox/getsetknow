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
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToDashboard}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 500,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: 2,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Box
            sx={{
              width: { xs: 60, sm: 80 },
              height: { xs: 60, sm: 80 },
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
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" },
            }}
          >
            {session?.companyName || "Game Leaderboard"}
          </Typography>
        </Box>

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
                ml: { xs: "auto", sm: "auto" },
                mr: { xs: "auto", sm: 0 },
                mt: { xs: 1, sm: 0 },
              }}
            >
              
              <Typography variant="body2" fontWeight="bold" sx={{ color: "text.secondary", fontSize:"16px" }}>
                Connections Established:{" "}
                <Typography component="span" fontWeight="bold" sx={{ color: "text.primary", fontSize:"20px" }}>
                  {data.connectionsCount}
                </Typography>
              </Typography>
            </Box>
          )}
      </Paper>

      <Box sx={{ px: { xs: 2, sm: 4 }, pb: 4 }}>
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
