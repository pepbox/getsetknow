import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material";
import { PlayerRanking } from "../types/interfaces";

interface PlayerLeaderboardProps {
  playerRankings: PlayerRanking[];
}

const PlayerLeaderboard: React.FC<PlayerLeaderboardProps> = ({
  playerRankings,
}) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700"; // Gold
      case 2:
        return "#C0C0C0"; // Silver
      case 3:
        return "#CD7F32"; // Bronze
      default:
        return "#E0E0E0"; // Default gray
    }
  };

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
        Player Leaderboard
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {playerRankings.map((player) => (
          <Card
            key={player?.id}
            sx={{
              position: "relative",
              border:
                player?.rank <= 3
                  ? `2px solid ${getRankColor(player?.rank)}`
                  : "1px solid #E0E0E0",
              borderRadius: "12px",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Chip
                label={getRankIcon(player?.rank)}
                sx={{
                  position: "absolute",
                  top: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: getRankColor(player.rank),
                  color: player.rank <= 3 ? "#000" : "#666",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              />

              <Avatar
                src={player?.profilePhoto || ""}
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  mt: 1,
                  border: `3px solid ${getRankColor(player?.rank)}`,
                }}
              >
                {player.name.charAt(0).toUpperCase()}
              </Avatar>

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={1}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {player?.name}
              </Typography>

              <Typography variant="h4" fontWeight="bold" color="primary" mb={1}>
                {player?.score}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Points
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default PlayerLeaderboard;
