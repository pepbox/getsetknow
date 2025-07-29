import { Edit as EditIcon } from "@mui/icons-material";
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
    openScoreModal?: (playerId: string, currentScore: number) => void
  ) => React.ReactNode;
};

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  gameStatus,
  transaction,
  onChangeName,
  onChangeScore,
  onViewResponses,
  playerWithResponses = null,
  loadingResponses = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [responsesModalOpen, setResponsesModalOpen] = useState(false);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Score change modal state
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [selectedPlayerIdForScore, setSelectedPlayerIdForScore] =
    useState<string>("");
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [scoreAdjustment, setScoreAdjustment] = useState<string>("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const openModal = (playerId: string, currentName: string) => {
    setSelectedPlayerId(playerId);
    setNewName(currentName);
    setModalOpen(true);
  };

  const openScoreModal = (playerId: string, playerCurrentScore: number) => {
    setSelectedPlayerIdForScore(playerId);
    setCurrentScore(playerCurrentScore);
    setScoreAdjustment("");
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
    if (onChangeScore && selectedPlayerIdForScore && !isNaN(adjustment)) {
      const newScore = Math.max(0, currentScore + adjustment); // Ensure score doesn't go below 0
      onChangeScore(selectedPlayerIdForScore, newScore);
      setScoreModalOpen(false);
      setSelectedPlayerIdForScore("");
      setCurrentScore(0);
      setScoreAdjustment("");
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

  const sortedPlayers = React.useMemo(() => {
    if (!sortField || !players) return players;

    return [...players].sort((a, b) => {
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
  }, [players, sortField, sortDirection]);

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
      visible: (gameStatus) => gameStatus !== "playing",
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
      visible: (gameStatus) => gameStatus !== "playing",
      render: (player) => player.questionsAnswered,
    },
    {
      key: "rank",
      label: "Rank",
      sortable: true,
      visible: (gameStatus) => gameStatus === "playing",
      render: (player) => player.rank,
    },
    {
      key: "peopleYouKnow",
      label: "People you know",
      sortable: true,
      visible: (gameStatus) => gameStatus === "playing",
      render: (player) => player.peopleYouKnow,
    },
    {
      key: "peopleWhoKnowYou",
      label: "People who know you",
      sortable: true,
      visible: (gameStatus) => gameStatus === "playing",
      render: (player) => player.peopleWhoKnowYou,
    },
    {
      key: "totalScore",
      label: "Total Score",
      sortable: true,
      visible: (gameStatus) => gameStatus === "playing",
      render: (player) => (
        <Typography fontWeight="medium">{player.totalScore}</Typography>
      ),
    },
    {
      key: "changeScore",
      label: "Change Score",
      sortable: false,
      visible: (gameStatus) => gameStatus === "playing",
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
      visible: (gameStatus) => gameStatus !== "playing",
      render: (player) => (
        <Chip
          label={
            player.questionsAnswered.split("/")[0] ===
            player.questionsAnswered.split("/")[1]
              ? "waiting"
              : "pending"
          }
          size="small"
          color={player.currentStatus === "pending" ? "warning" : "default"}
        />
      ),
    },
    {
      key: "viewResponses",
      label: "View Responses",
      sortable: false,
      visible: (gameStatus) => gameStatus !== "playing",
      render: (player) => (
        <Button
          variant="text"
          size="small"
          onClick={() => handleViewResponses(player.id)}
        >
          Show
        </Button>
      ),
    },
  ];

  const getRowColor = (index: number) =>
    index % 2 === 0 ? "#11111108" : "#11111100";
  const visibleColumns = columns.filter((col) => col.visible(gameStatus));

  return (
    <>
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
          {sortedPlayers?.map((player, index) => (
            <Paper
              key={player.id}
              elevation={0}
              sx={{
                borderRadius: 2,
                backgroundColor: getRowColor(index),
                p: 2,
              }}
            >
              {visibleColumns.map((col, colIdx) => (
                <Box
                  key={col.key}
                  mb={colIdx < visibleColumns.length - 1 ? 1.5 : 0}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {col.label}
                  </Typography>
                  <Box mt={0.5}>
                    {col.render(
                      player,
                      onChangeName,
                      onViewResponses,
                      transaction,
                      openModal,
                      onChangeScore,
                      openScoreModal
                    )}
                  </Box>
                  {colIdx < visibleColumns.length - 1 && (
                    <Divider sx={{ my: 1 }} />
                  )}
                </Box>
              ))}
            </Paper>
          ))}
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
                        openScoreModal
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
        fullWidth
      >
        <DialogTitle>Change Player Score</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Current Score: <strong>{currentScore}</strong>
            </Typography>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Score Adjustment (e.g., +50 or -30)"
            type="number"
            fullWidth
            variant="outlined"
            value={scoreAdjustment}
            onChange={(e) => setScoreAdjustment(e.target.value)}
            placeholder="Enter positive or negative number"
            helperText={
              scoreAdjustment && !isNaN(parseInt(scoreAdjustment))
                ? `New Score: ${Math.max(
                    0,
                    currentScore + parseInt(scoreAdjustment)
                  )}`
                : "Enter a number to see preview"
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScoreModal}>Cancel</Button>
          <Button
            onClick={handleChangeScore}
            variant="contained"
            disabled={!scoreAdjustment || isNaN(parseInt(scoreAdjustment))}
          >
            Change Score
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
    </>
  );
};

export default PlayerTable;
