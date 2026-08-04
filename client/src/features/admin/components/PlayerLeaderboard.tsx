import React from "react";
import {
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import { PlayerRanking } from "../types/interfaces";

interface PlayerLeaderboardProps {
  playerRankings: PlayerRanking[];
}

const PlayerLeaderboard: React.FC<PlayerLeaderboardProps> = ({
  playerRankings,
}) => {


  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        textAlign="center"
        color="primary"
      >
        🏆 Player Leaderboard
      </Typography>
      
      {/* WhatsApp-style vertical list */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {playerRankings.map((player, index) => (
          <Box
            key={player?.id}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              borderBottom: index < playerRankings.length - 1 ? "1px solid #f0f0f0" : "none",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "#f8f9fa",
              },
            }}
          >
            {/* Rank Badge */}
            <Box
              sx={{
                minWidth: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 2,
                fontWeight: "bold",
                fontSize: "20px",
                color: player?.rank === 1 ? "#D4AF37" : player?.rank === 2 ? "#9CA3AF" : player?.rank === 3 ? "#CD7F32" : "#9CA3AF",
              }}
            >
              {getRankIcon(player?.rank)}
            </Box>

            {/* Player Avatar */}
            <Avatar
              src={player?.profilePhoto || ""}
              sx={{
                width: 54,
                height: 54,
                marginRight: 2,
                border: player?.rank === 1
                  ? "2px solid #F59E0B"
                  : player?.rank === 2
                  ? "2px solid #9CA3AF"
                  : player?.rank === 3
                  ? "2px solid #CD7F32"
                  : "1px solid #E5E7EB",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              {player.name.charAt(0).toUpperCase()}
            </Avatar>

            {/* Player Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  mb: 0.5,
                }}
              >
                {player?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                Rank #{player?.rank} {player?.teamNumber ? `• Cluster ${player.teamNumber}` : ""} • {player?.wrongGuesses ?? 0} Wrong Guesses
              </Typography>
            </Box>

            {/* Score */}
            <Box
              sx={{
                textAlign: "right",
                minWidth: 80,
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                sx={{ lineHeight: 1 }}
              >
                {player?.score}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                points
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PlayerLeaderboard;
