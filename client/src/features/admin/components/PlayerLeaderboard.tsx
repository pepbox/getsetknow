import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Collapse,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { PlayerRanking } from "../types/interfaces";

interface PlayerLeaderboardProps {
  playerRankings: PlayerRanking[];
  onClose?: () => void;
}

interface ClusterGroup {
  clusterId: string | number;
  displayName: string;
  players: (PlayerRanking & { clusterRank: number })[];
}

const PlayerLeaderboard: React.FC<PlayerLeaderboardProps> = ({
  playerRankings,
  onClose,
}) => {
  const [expandedCluster, setExpandedCluster] = useState<string | number | null>(null);
  const [showAllPlayers, setShowAllPlayers] = useState<boolean>(false);

  // Group players by cluster/teamNumber and sort within each cluster
  const clusterGroups = useMemo<ClusterGroup[]>(() => {
    if (!playerRankings || playerRankings.length === 0) return [];

    const map = new Map<string | number, PlayerRanking[]>();

    playerRankings.forEach((player) => {
      const clusterKey = player.teamNumber ?? "unassigned";
      if (!map.has(clusterKey)) {
        map.set(clusterKey, []);
      }
      map.get(clusterKey)!.push(player);
    });

    const groups: ClusterGroup[] = [];

    map.forEach((players, key) => {
      // Sort players in this cluster by score descending, then wrongGuesses ascending
      const sorted = [...players].sort((a, b) => {
        const scoreA = a.score || 0;
        const scoreB = b.score || 0;
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        const wrongA = a.wrongGuesses ?? 0;
        const wrongB = b.wrongGuesses ?? 0;
        return wrongA - wrongB;
      });

      // Add local cluster rank
      const playersWithClusterRank = sorted.map((p, idx) => ({
        ...p,
        clusterRank: idx + 1,
      }));

      const displayName = key === "unassigned" ? "Other Players" : `Cluster ${key}`;

      groups.push({
        clusterId: key,
        displayName,
        players: playersWithClusterRank,
      });
    });

    // Sort cluster groups numerically (Cluster 1, Cluster 2, ..., then unassigned)
    groups.sort((a, b) => {
      if (a.clusterId === "unassigned") return 1;
      if (b.clusterId === "unassigned") return -1;
      const numA = Number(a.clusterId);
      const numB = Number(b.clusterId);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return String(a.clusterId).localeCompare(String(b.clusterId));
    });

    return groups;
  }, [playerRankings]);

  const handleClusterClick = (clusterId: string | number) => {
    if (expandedCluster === clusterId) {
      setExpandedCluster(null);
      setShowAllPlayers(false);
    } else {
      setExpandedCluster(clusterId);
      setShowAllPlayers(false);
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
      {/* Header */}
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

      {/* Cluster List / Accordion Stack */}
      {clusterGroups.length === 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            p: 3,
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No player rankings available yet.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {clusterGroups.map((group) => {
            const isExpanded = expandedCluster === group.clusterId;
            const displayedPlayers = isExpanded
              ? showAllPlayers
                ? group.players
                : group.players.slice(0, 3)
              : [];

            return (
              <Box key={String(group.clusterId)}>
                {/* Cluster Button */}
                <Button
                  fullWidth
                  onClick={() => handleClusterClick(group.clusterId)}
                  sx={{
                    backgroundColor: "#8B5CF6",
                    color: "#ffffff",
                    borderRadius: "14px",
                    py: 1.5,
                    px: 3,
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "1.05rem",
                    boxShadow: "0 2px 6px rgba(139, 92, 246, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#7C3AED",
                      boxShadow: "0 4px 10px rgba(124, 58, 237, 0.35)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {group.displayName}
                </Button>

                {/* Expanded Player List (Exact current list UI) */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      mt: 1.25,
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      border: "1px solid #f0f0f0",
                      overflow: "hidden",
                    }}
                  >
                    {displayedPlayers.map((player, index) => (
                      <Box
                        key={player?.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: { xs: 1.5, sm: 2 },
                          borderBottom:
                            index < displayedPlayers.length - 1
                              ? "1px solid #f0f0f0"
                              : group.players.length > 3
                              ? "1px solid #f0f0f0"
                              : "none",
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
                            color:
                              player?.clusterRank === 1
                                ? "#D4AF37"
                                : player?.clusterRank === 2
                                ? "#9CA3AF"
                                : player?.clusterRank === 3
                                ? "#CD7F32"
                                : "#9CA3AF",
                          }}
                        >
                          {getRankIcon(player?.clusterRank)}
                        </Box>

                        {/* Player Avatar */}
                        <Avatar
                          src={player?.profilePhoto || ""}
                          sx={{
                            width: { xs: 44, sm: 54 },
                            height: { xs: 44, sm: 54 },
                            marginRight: { xs: 1.5, sm: 2 },
                            border:
                              player?.clusterRank === 1
                                ? "2px solid #F59E0B"
                                : player?.clusterRank === 2
                                ? "2px solid #9CA3AF"
                                : player?.clusterRank === 3
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
                            Rank #{player?.clusterRank}{" "}
                            {player?.teamNumber ? `• Cluster ${player.teamNumber}` : ""}
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

                    {/* View Entire List Toggle Button (when cluster has > 3 players) */}
                    {group.players.length > 3 && (
                      <Box sx={{ p: 1, textAlign: "center" }}>
                        <Button
                          fullWidth
                          size="small"
                          onClick={() => setShowAllPlayers((prev) => !prev)}
                          endIcon={
                            showAllPlayers ? (
                              <KeyboardArrowUpIcon fontSize="small" />
                            ) : (
                              <KeyboardArrowDownIcon fontSize="small" />
                            )
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            color: "primary.main",
                            py: 0.75,
                            "&:hover": {
                              backgroundColor: "rgba(167, 139, 250, 0.08)",
                            },
                          }}
                        >
                          {showAllPlayers
                            ? "Show Top 3 Only"
                            : `View Entire List (${group.players.length} players)`}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default PlayerLeaderboard;
