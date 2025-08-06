import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayerLeaderboard from "./PlayerLeaderboard";
import SelfiesGallery from "./SelfiesGallery";
import { LeaderboardProps } from "../types/interfaces";
import { useAppSelector } from "../../../app/rootReducer";
import { RootState } from "../../../app/store";
import Loader from "../../../components/ui/Loader";

const Leaderboard: React.FC<LeaderboardProps> = ({ data, isLoading }) => {
  const navigate = useNavigate();
  const { sessionId } = useAppSelector((state: RootState) => state.game);

  const handleBackToDashboard = () => {
    navigate(`/admin/${sessionId}/dashboard`);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
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
          backgroundColor: "rgba(252, 166, 30, 0.10)",
          borderRadius: 0,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
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
        </Box>
        
        <Typography
          variant="h3"
          fontWeight="bold"
          color="black"
          textAlign="center"
        >
          🏆 Game Leaderboard 🏆
        </Typography>
      </Paper>

      <Box sx={{ px: 4, pb: 4 }}>
        {/* Player Leaderboard Section */}
        <Box sx={{ mb: 6 }}>
          <PlayerLeaderboard playerRankings={data.playerRankings} />
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Selfies Gallery Section */}
        <Box>
          <SelfiesGallery selfies={data.selfies} />
        </Box>
      </Box>
    </Box>
  );
};

export default Leaderboard;
