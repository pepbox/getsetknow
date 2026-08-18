import { Edit as EditIcon, Clear as ClearIcon } from "@mui/icons-material";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  TableSortLabel,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import { PlayerTableProps } from "../types/interfaces";
import PlayerResponsesModal from "./PlayerResponsesModal";

type Column = {
  key: string;
  label: string;
  sortable?: boolean;
  visible: (gameStatus: string) => boolean;
  render: (
    player: any,
    onChangeName?: (id: string, name: string) => void,
    onViewResponses?: (id: string) => void,
    transaction?: boolean,
    openNameModal?: (playerId: string, currentName: string) => void,
    onChangeScore?: (id: string, newScore: number) => void,
    openScoreModal?: (playerId: string, currentScore: number) => void,
    openRemoveModal?: (playerId: string, name: string) => void
  ) => React.ReactNode;
};

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  gameStatus,
  transaction,
  onChangeName,
  onChangeScore,
  onViewResponses,
  onRemovePlayer,
  playerWithResponses = null,
  loadingResponses = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [responsesModalOpen, setResponsesModalOpen] = useState(false);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedTeam, setSelectedTeam] = useState<string>(""); // Team filter state
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state

  // Score change modal state
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [selectedPlayerIdForScore, setSelectedPlayerIdForScore] =
    useState<string>("");
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [scoreAdjustment, setScoreAdjustment] = useState<string>("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  // Double verification modal state for player removal
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [confirmRemoveDialogOpen, setConfirmRemoveDialogOpen] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState<{ id: string; name: string } | null>(null);

  const openRemoveModal = (playerId: string, playerName: string) => {
    setPlayerToRemove({ id: playerId, name: playerName });
    setRemoveDialogOpen(true);
  };

  const handleRemoveFirstStepConfirm = () => {
    setRemoveDialogOpen(false);
    setConfirmRemoveDialogOpen(true);
  };

  const handleRemoveCancel = () => {
    setRemoveDialogOpen(false);
    setConfirmRemoveDialogOpen(false);
    setPlayerToRemove(null);
  };

  const handleRemoveFinalConfirm = () => {
    if (onRemovePlayer && playerToRemove) {
      onRemovePlayer(playerToRemove.id);
    }
    setConfirmRemoveDialogOpen(false);
    setPlayerToRemove(null);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const totalPlayersJoined = players ? players.length : 0;
  const pendingPlayersCount = players
    ? players.filter((player) => {
        if (!player.questionsAnswered) return false;
        const [answered, total] = player.questionsAnswered.split("/").map(Number);
        return answered < total;
      }).length
    : 0;

  const openModal = (playerId: string, currentName: string) => {
    setSelectedPlayerId(playerId);
    setNewName(currentName);
    setModalOpen(true);
  };

  const openScoreModal = (playerId: string, playerCurrentScore: number) => {
    setSelectedPlayerIdForScore(playerId);
    setCurrentScore(playerCurrentScore);
    setScoreAdjustment("");
    setOperation("add");
    setScoreModalOpen(true);
  };

  const handleChangeName = () => {
    if (onChangeName && selectedPlayerId && newName.trim()) {
      onChangeName(selectedPlayerId, newName.trim());
      setModalOpen(false);
      setSelectedPlayerId("");
      setNewName("");
    }
  };

  const handleChangeScore = () => {
    const adjustment = parseInt(scoreAdjustment);
    if (
      onChangeScore &&
      selectedPlayerIdForScore &&
      !isNaN(adjustment) &&
      adjustment > 0
    ) {
      const finalAdjustment =
        operation === "subtract" ? -adjustment : adjustment;
      const newScore = Math.max(0, currentScore + finalAdjustment);
      onChangeScore(selectedPlayerIdForScore, newScore);
      setScoreModalOpen(false);
      setSelectedPlayerIdForScore("");
      setCurrentScore(0);
      setScoreAdjustment("");
      setOperation("add");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlayerId("");
    setNewName("");
  };

  const handleCloseScoreModal = () => {
    setScoreModalOpen(false);
    setSelectedPlayerIdForScore("");
    setCurrentScore(0);
    setScoreAdjustment("");
    setOperation("add");
  };

  const handleViewResponses = (playerId: string) => {
    if (onViewResponses) {
      onViewResponses(playerId);
      setResponsesModalOpen(true);
    }
  };

  const handleCloseResponsesModal = () => {
    setResponsesModalOpen(false);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleTeamFilter = (team: string) => {
    setSelectedTeam(team);
  };

  const clearTeamFilter = () => {
    setSelectedTeam("");
  };

  // Get unique teams for filter dropdown
  const uniqueTeams = React.useMemo(() => {
    if (!players) return [];
    const teams = [...new Set(players.map((player) => player.team))].filter(
      Boolean
    );
    return teams.sort((a, b) => {
      const aNum = parseInt(String(a || "").replace(/\D/g, "")) || 0;
      const bNum = parseInt(String(b || "").replace(/\D/g, "")) || 0;
      return aNum - bNum;
    });
  }, [players]);

  // Filter players by selected team and search query
  const filteredPlayers = React.useMemo(() => {
    let filtered = players || [];

    // Filter by team if selected
    if (selectedTeam) {
      filtered = filtered.filter((player) => player.team === selectedTeam);
    }

    // Filter by search query if provided
    if (searchQuery.trim()) {
      filtered = filtered.filter((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }

    return filtered;
  }, [players, selectedTeam, searchQuery]);

  // Calculate team rank for filtered players
  const playersWithTeamRank = React.useMemo(() => {
    if (!filteredPlayers) return filteredPlayers;

    if (selectedTeam) {
      // Sort by totalScore descending and wrongGuesses ascending to calculate team rank
      const sortedByScore = [...filteredPlayers].sort((a, b) => {
        if ((b.totalScore || 0) !== (a.totalScore || 0)) {
          return (b.totalScore || 0) - (a.totalScore || 0);
        }
        return (a.wrongGuesses || 0) - (b.wrongGuesses || 0);
      });
      return sortedByScore.map((player, index) => ({
        ...player,
        teamRank: index + 1,
      }));
    }

    return filteredPlayers;
  }, [filteredPlayers, selectedTeam]);

  const sortedPlayers = React.useMemo(() => {
    if (!sortField || !playersWithTeamRank) return playersWithTeamRank;

    return [...playersWithTeamRank].sort((a, b) => {
      let aValue = (a as any)[sortField];
      let bValue = (b as any)[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle string values
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue
          .toLowerCase()
          .localeCompare(bValue.toLowerCase());
        return sortDirection === "asc" ? comparison : -comparison;
      }

      // Handle mixed or undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      // Convert to string for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      const comparison = aStr.localeCompare(bStr);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [playersWithTeamRank, sortField, sortDirection]);

  const columns: Column[] = [
    {
      key: "name",
      label: "Player Name",
      sortable: true,
      visible: () => true,
      render: (player) => player.name,
    },
    {
      key: "changeName",
      label: "Change name",
      sortable: false,
      visible: (gameStatus) => gameStatus !== "playing" && gameStatus !== "paused",
      render: (player, _onChangeName, _, transaction, openNameModal) => (
        <Tooltip title={!transaction ? "Enable transactions first" : ""}>
          <span>
            <IconButton
              size="small"
              disabled={!transaction}
              onClick={() => openNameModal?.(player.id, player.name)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      ),
    },
    {
      key: "questionsAnswered",
      label: "Questions Answered",
      sortable: true,
      visible: (gameStatus) => gameStatus !== "playing" && gameStatus !== "paused",
      render: (player) => player.questionsAnswered,
    },
    {
      key: "rank",
      label: "Cluster Rank",
      sortable: true,
      visible: (gameStatus) => gameStatus === "playing" || gameStatus === "paused",
      render: (player) =>
        selectedTeam ? (player as any).teamRank || player.rank : player.rank,
    },
    {
      key: "team",
      label: "Cluster",
      sortable: true,
      visible: () => true,
      render: (player) => player.team,
    },
    {
      key: "peopleYouKnow",
      label: "People you know",
      sortable: true,
      visible: (gameStatus) => gameStatus === "playing" || gameStatus === "paused",
      render: (player) => player.peopleYouKnow,
    },
    {
      key: "peopleWhoKnowYou",
      label: "People who know you",
      sortable: true,
      visible: (gameStatus) => gameStatus === "playing" || gameStatus === "paused",
      render: (player) => player.peopleWhoKnowYou,
    },
    {
      key: "wrongGuesses",
      label: "Wrong Guesses",
      sortable: true,
      visible: (gameStatus) => gameStatus === "playing" || gameStatus === "paused",
      render: (player) => player.wrongGuesses ?? 0,
    },
    {
      key: "totalScore",
      label: "Total Score",
      sortable: true,
      visible: (gameStatus) => gameStatus === "playing" || gameStatus === "paused",
      render: (player) => (
        <Typography fontWeight="medium">{player.totalScore}</Typography>
      ),
    },
    {
      key: "changeScore",
      label: "Change Score",
      sortable: false,
      visible: (gameStatus) => gameStatus === "playing" || gameStatus === "paused",
      render: (
        player,
        _onChangeName,
        _,
        transaction,
        _openNameModal,
        _onChangeScore,
        openScoreModal
      ) => (
        <Tooltip title={!transaction ? "Enable transactions first" : ""}>
          <span>
            <IconButton
              size="small"
              disabled={!transaction}
              onClick={() =>
                openScoreModal?.(player.id, player.totalScore || 0)
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      ),
    },
    {
      key: "currentStatus",
      label: "Current Status",
      sortable: true,
      visible: (gameStatus) => gameStatus !== "playing" && gameStatus !== "paused",
      render: (player) => (
        <Chip
          label={
            player.questionsAnswered.split("/")[0] ===
            player.questionsAnswered.split("/")[1]
              ? "waiting"
              : "pending"
          }
          size="small"
          color={
            player.questionsAnswered.split("/")[0] ===
            player.questionsAnswered.split("/")[1]
              ? "primary"
              : "warning"
          }
        />
      ),
    },
    {
      key: "viewResponses",
      label: "View Responses",
      sortable: false,
      visible: () => true,
      render: (player) => (
        <Button
          variant="outlined"
          size="small"
          sx={{
            padding: "2px 4px",
            color: "black",
            borderColor: "black",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "black",
            },
          }}
          onClick={() => handleViewResponses(player.id)}
        >
          Show
        </Button>
      ),
    },
    {
      key: "removePlayer",
      label: "Remove",
      sortable: false,
      visible: (status) => status !== "ended",
      render: (
        player,
        _onChangeName,
        _,
        transaction,
        _openNameModal,
        _onChangeScore,
        _openScoreModal,
        openRemoveModal
      ) => (
        <Tooltip title={!transaction ? "Enable transactions first" : ""}>
          <span>
            <IconButton
              size="small"
              disabled={!transaction}
              color="error"
              onClick={() => openRemoveModal?.(player.id, player.name)}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      ),
    },
  ];

  const getRowColor = (index: number) =>
    index % 2 === 0 ? "#11111108" : "#11111100";
  const visibleColumns = columns.filter((col) => col.visible(gameStatus));

  return (
    <>
      {/* Search and Team Filter */}
      <Box
        mb={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexDirection: { xs: "column", sm: "row" },
            width: { xs: "100%", md: "auto" },
          }}
        >
          <TextField
            size="small"
            placeholder="Search players by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: { xs: "100%", sm: 200 },
              maxWidth: { xs: "100%", sm: 300 },
              flex: 1,
            }}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, color: "text.secondary" }}>🔍</Box>
              ),
            }}
          />
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 170 },
              flex: { xs: 1, sm: 0 },
            }}
          >
            <InputLabel>Filter by Cluster</InputLabel>
            <Select
              value={selectedTeam}
              onChange={(e) => handleTeamFilter(e.target.value)}
              label="Filter by Cluster"
            >
              <MenuItem value="">
                <em>All Clusters</em>
              </MenuItem>
              {uniqueTeams.map((team) => (
                <MenuItem key={team} value={team}>
                  Cluster {team}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {(selectedTeam || searchQuery) && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={() => {
                clearTeamFilter();
                setSearchQuery("");
              }}
              sx={{
                color: "text.secondary",
                borderColor: "text.secondary",
                padding: "6px 8px",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  backgroundColor: "action.hover",
                  borderColor: "text.primary",
                  color: "text.primary",
                },
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Statistics on the right side */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-end" },
            mt: { xs: 0.5, md: 0 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="text.secondary"
              sx={{
                textTransform: "uppercase",
                fontSize: "11px",
                letterSpacing: "0.05em",
              }}
            >
              Joined:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              {totalPlayersJoined}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="text.secondary"
              sx={{
                textTransform: "uppercase",
                fontSize: "11px",
                letterSpacing: "0.05em",
              }}
            >
              Pending:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="warning.main">
              {pendingPlayersCount}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filter Status Info */}
      {(selectedTeam || searchQuery) && (
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            {searchQuery && selectedTeam
              ? `Showing ${
                  filteredPlayers?.length || 0
                } players matching "${searchQuery}" in Cluster ${selectedTeam}`
              : searchQuery
              ? `Showing ${
                  filteredPlayers?.length || 0
                } players matching "${searchQuery}"`
              : `Showing ${
                  filteredPlayers?.length || 0
                } players from Cluster ${selectedTeam}`}
          </Typography>
        </Box>
      )}

      {!isMobile && visibleColumns.some((col) => col.sortable) && (
        <Box mb={1}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontStyle: "italic",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            💡 Click on column headers to sort the table
          </Typography>
        </Box>
      )}
      {isMobile ? (
        <Stack spacing={2}>
          {sortedPlayers?.map((player, index) => {
            const isWaiting =
              player.questionsAnswered.split("/")[0] ===
              player.questionsAnswered.split("/")[1];
            const currentRank = selectedTeam
              ? (player as any).teamRank || player.rank
              : player.rank;

            return (
              <Paper
                key={player.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  backgroundColor: getRowColor(index),
                  p: 2.5,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {/* Header: Name, Team, Status */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                      {player.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Cluster {player.team || "N/A"}
                    </Typography>
                  </Box>

                  {/* Status chip or Rank badge */}
                  {gameStatus === "playing" || gameStatus === "paused" ? (
                    <Chip
                      label={`Cluster Rank #${currentRank}`}
                      size="small"
                      color="secondary"
                      sx={{ fontWeight: "bold" }}
                    />
                  ) : (
                    <Chip
                      label={isWaiting ? "waiting" : "pending"}
                      size="small"
                      color={isWaiting ? "primary" : "warning"}
                    />
                  )}
                </Box>

                <Divider sx={{ mb: 1.5, opacity: 0.6 }} />

                {/* Metrics Grid */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  {/* Score */}
                  {(gameStatus === "playing" || gameStatus === "paused") && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Total Score
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        {player.totalScore || 0} pts
                      </Typography>
                    </Box>
                  )}

                  {/* Wrong Guesses */}
                  {(gameStatus === "playing" || gameStatus === "paused") && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Wrong Guesses
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="text.primary">
                        {player.wrongGuesses ?? 0}
                      </Typography>
                    </Box>
                  )}

                  {/* People You Know */}
                  {(gameStatus === "playing" || gameStatus === "paused") && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        People You Know
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" color="text.primary">
                        {player.peopleYouKnow || 0}
                      </Typography>
                    </Box>
                  )}

                  {/* People Who Know You */}
                  {(gameStatus === "playing" || gameStatus === "paused") && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        People Who Know You
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" color="text.primary">
                        {player.peopleWhoKnowYou || 0}
                      </Typography>
                    </Box>
                  )}

                  {/* Questions Answered */}
                  {gameStatus !== "playing" && gameStatus !== "ended" && gameStatus !== "paused" && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Questions Answered
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="text.primary">
                        {player.questionsAnswered}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Actions Row */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                    pt: 1.5,
                    borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        padding: "4px 10px",
                        color: "black",
                        borderColor: "black",
                        textTransform: "none",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          borderColor: "black",
                        },
                      }}
                      onClick={() => handleViewResponses(player.id)}
                    >
                      Show Responses
                    </Button>
                  </Box>

                  {/* Edit Controls */}
                  {transaction && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {/* Edit Name */}
                      {gameStatus !== "playing" && gameStatus !== "paused" && (
                        <Tooltip title="Edit Name">
                          <IconButton
                            size="small"
                            onClick={() => openModal(player.id, player.name)}
                            sx={{ border: "1px solid #E5E7EB", borderRadius: "6px" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Edit Score */}
                      {(gameStatus === "playing" || gameStatus === "paused") && (
                        <Tooltip title="Edit Score">
                          <IconButton
                            size="small"
                            onClick={() => openScoreModal(player.id, player.totalScore || 0)}
                            sx={{ border: "1px solid #E5E7EB", borderRadius: "6px" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Remove Player */}
                      {gameStatus !== "ended" && (
                        <Tooltip title="Remove Player">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openRemoveModal(player.id, player.name)}
                            sx={{ border: "1px solid #EF4444", borderRadius: "6px" }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 2, overflow: "hidden" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {visibleColumns.map((col) => (
                  <TableCell key={col.key} sx={{ fontWeight: "bold" }}>
                    {col.sortable ? (
                      <TableSortLabel
                        active={sortField === col.key}
                        direction={
                          sortField === col.key ? sortDirection : "asc"
                        }
                        onClick={() => handleSort(col.key)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            color: "primary.main",
                          },
                          "&.Mui-active": {
                            color: "primary.main",
                            fontWeight: "bold",
                          },
                          "& .MuiTableSortLabel-icon": {
                            opacity: sortField === col.key ? 1 : 0.5,
                          },
                          "&:hover .MuiTableSortLabel-icon": {
                            opacity: 1,
                          },
                        }}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPlayers?.map((player, index) => (
                <TableRow
                  key={player.id}
                  sx={{ backgroundColor: getRowColor(index) }}
                >
                  {visibleColumns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render(
                        player,
                        onChangeName,
                        onViewResponses,
                        transaction,
                        openModal,
                        onChangeScore,
                        openScoreModal,
                        openRemoveModal
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Name Change Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Player Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Player Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleChangeName} variant="contained">
            Change Name
          </Button>
        </DialogActions>
      </Dialog>

      {/* Score Change Modal */}
      <Dialog
        open={scoreModalOpen}
        onClose={handleCloseScoreModal}
        maxWidth="sm"
      >
        <DialogTitle>Edit Score</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Current Score:
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {currentScore} points
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Operation:
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant={operation === "add" ? "contained" : "outlined"}
                onClick={() => setOperation("add")}
                sx={{
                  flex: 1,
                  backgroundColor:
                    operation === "add" ? "#4caf50" : "transparent",
                  color: operation === "add" ? "white" : "#4caf50",
                  borderColor: "#4caf50",
                  "&:hover": {
                    backgroundColor:
                      operation === "add"
                        ? "#45a049"
                        : "rgba(76, 175, 80, 0.1)",
                  },
                  py: 1,
                }}
                startIcon={<span>+</span>}
              >
                Add Points
              </Button>
              <Button
                variant={operation === "subtract" ? "contained" : "outlined"}
                onClick={() => setOperation("subtract")}
                sx={{
                  flex: 1,
                  textWrap: "nowrap",
                  backgroundColor:
                    operation === "subtract" ? "#f44336" : "transparent",
                  color: operation === "subtract" ? "white" : "#f44336",
                  borderColor: "#f44336",
                  "&:hover": {
                    backgroundColor:
                      operation === "subtract"
                        ? "#e53935"
                        : "rgba(244, 67, 54, 0.1)",
                  },
                  py: 1,
                }}
                startIcon={<span>−</span>}
              >
                Subtract Points
              </Button>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Enter points to {operation}:
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              placeholder="Enter points"
              type="number"
              fullWidth
              variant="outlined"
              value={scoreAdjustment}
              onChange={(e) => setScoreAdjustment(e.target.value)}
              inputProps={{
                min: 0,
                step: 1,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.87)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseScoreModal}
            sx={{
              color: "text.secondary",
              px: 3,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleChangeScore}
            variant="contained"
            disabled={
              !scoreAdjustment ||
              isNaN(parseInt(scoreAdjustment)) ||
              parseInt(scoreAdjustment) <= 0
            }
            sx={{
              backgroundColor: operation === "add" ? "#4caf50" : "#f44336",
              px: 3,
              py: 1,
              "&:hover": {
                backgroundColor: "#45a049",
              },
              "&:disabled": {
                backgroundColor: "rgba(0, 0, 0, 0.12)",
                color: "rgba(0, 0, 0, 0.26)",
              },
            }}
          >
            {operation === "add" ? "Add Points" : "Subtract Points"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Player Responses Modal */}
      <PlayerResponsesModal
        open={responsesModalOpen}
        onClose={handleCloseResponsesModal}
        playerWithResponses={playerWithResponses}
        loading={loadingResponses}
      />

      {/* Remove Player Modal - Step 1 */}
      <Dialog open={removeDialogOpen} onClose={handleRemoveCancel}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Remove Player</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove <strong>{playerToRemove?.name}</strong> from this session?
            This will immediately log them out of their device, and they will no longer participate in this session.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleRemoveCancel} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            onClick={handleRemoveFirstStepConfirm}
            variant="contained"
            color="error"
            sx={{ px: 3 }}
          >
            Remove Player
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Player Modal - Step 2 (Double Verification) */}
      <Dialog open={confirmRemoveDialogOpen} onClose={handleRemoveCancel}>
        <DialogTitle sx={{ fontWeight: "bold", color: "error.main" }}>
          Confirm Irreversible Action
        </DialogTitle>
        <DialogContent>
          <Typography>
            <strong>WARNING:</strong> This action cannot be undone. All responses and guesses associated with <strong>{playerToRemove?.name}</strong> will be permanently deleted from the database.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleRemoveCancel} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            onClick={handleRemoveFinalConfirm}
            variant="contained"
            color="error"
            sx={{
              backgroundColor: "#d32f2f",
              px: 3,
              "&:hover": {
                backgroundColor: "#c62828",
              },
            }}
          >
            Yes, Permanently Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlayerTable;
