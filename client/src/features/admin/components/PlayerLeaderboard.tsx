import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { PlayerRanking } from "../types/interfaces";

interface PlayerLeaderboardProps {
  playerRankings: PlayerRanking[];
  onClose?: () => void;
}

const PlayerLeaderboard: React.FC<PlayerLeaderboardProps> = ({
  playerRankings,
  onClose,
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
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
          sx={{ flexGrow: 1, textAlign: "center", pl: onClose ? 4 : 0 }}
        >
          🏆 Player Leaderboard
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
            <VisibilityOffIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
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
              p: { xs: 1.5, sm: 2 },
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
                minWidth: { xs: 30, sm: 40 },
                height: { xs: 30, sm: 40 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: { xs: 1, sm: 2 },
                fontWeight: "bold",
                fontSize: { xs: "16px", sm: "20px" },
                color: player?.rank === 1 ? "#D4AF37" : player?.rank === 2 ? "#9CA3AF" : player?.rank === 3 ? "#CD7F32" : "#9CA3AF",
              }}
            >
              {getRankIcon(player?.rank)}
            </Box>

            {/* Player Avatar */}
            <Avatar
              src={player?.profilePhoto || ""}
              sx={{
                width: { xs: 44, sm: 54 },
                height: { xs: 44, sm: 54 },
                marginRight: { xs: 1.5, sm: 2 },
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
                  fontSize: { xs: "0.95rem", sm: "1.1rem" },
                }}
              >
                {player?.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Rank #{player?.rank} {player?.teamNumber ? `• Cluster ${player.teamNumber}` : ""}
              </Typography>
            </Box>

            {/* Score */}
            <Box
              sx={{
                textAlign: "right",
                minWidth: { xs: 60, sm: 80 },
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                sx={{
                  lineHeight: 1,
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                }}
              >
                {player?.score}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                }}
              >
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
