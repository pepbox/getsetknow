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
} from "@mui/material";
import React, { useState } from "react";
import { PlayerTableProps } from "../types/interfaces";
import PlayerResponsesModal from "./PlayerResponsesModal"; // Import the modal component

type Column = {
  key: string;
  label: string;
  visible: (gameStatus: string) => boolean;
  render: (
    player: any,
    onChangeName?: (id: string, name: string) => void,
    onViewResponses?: (id: string) => void,
    transaction?: boolean,
    openModal?: (playerId: string, currentName: string) => void
  ) => React.ReactNode;
};

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  gameStatus,
  transaction,
  onChangeName,
  onViewResponses,
  playerWithResponses = null, // Default value for playerWithResponses
  loadingResponses = false, // Add loading state prop
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [responsesModalOpen, setResponsesModalOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const openModal = (playerId: string, currentName: string) => {
    setSelectedPlayerId(playerId);
    setNewName(currentName);
    setModalOpen(true);
  };

  const handleChangeName = () => {
    if (onChangeName && selectedPlayerId && newName.trim()) {
      onChangeName(selectedPlayerId, newName.trim());
      setModalOpen(false);
      setSelectedPlayerId("");
      setNewName("");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlayerId("");
    setNewName("");
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

  const columns: Column[] = [
    {
      key: "name",
      label: "Player Name",
      visible: () => true,
      render: (player) => player.name,
    },
    {
      key: "changeName",
      label: "Change name",
      visible: (gameStatus) => gameStatus !== "playing",
      render: (player, _onChangeName, _, transaction, openModal) => (
        <IconButton
          size="small"
          disabled={!transaction}
          onClick={() => openModal?.(player.id, player.name)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
    {
      key: "questionsAnswered",
      label: "Questions Answered",
      visible: (gameStatus) => gameStatus !== "playing",
      render: (player) => player.questionsAnswered,
    },
    {
      key: "rank",
      label: "Rank",
      visible: (gameStatus) => gameStatus === "playing",
      render: (player) => player.rank,
    },
    {
      key: "peopleYouKnow",
      label: "People you know",
      visible: (gameStatus) => gameStatus === "playing",
      render: (player) => player.peopleYouKnow,
    },
    {
      key: "peopleWhoKnowYou",
      label: "People who know you",
      visible: (gameStatus) => gameStatus === "playing",
      render: (player) => player.peopleWhoKnowYou,
    },
    {
      key: "totalScore",
      label: "Total Score",
      visible: (gameStatus) => gameStatus === "playing",
      render: (player) => (
        <Typography fontWeight="medium">{player.totalScore}</Typography>
      ),
    },
    {
      key: "currentStatus",
      label: "Current Status",
      visible: (gameStatus) => gameStatus !== "playing",
      render: (player) => (
        <Chip
          label={player.currentStatus || "pending"}
          size="small"
          color={player.currentStatus === "pending" ? "warning" : "default"}
        />
      ),
    },
    {
      key: "viewResponses",
      label: "View Responses",
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
      {isMobile ? (
        <Stack spacing={2}>
          {players.map((player, index) => (
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
                <Box key={col.key} mb={colIdx < visibleColumns.length - 1 ? 1.5 : 0}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {col.label}
                  </Typography>
                  <Box mt={0.5}>{col.render(
                    player,
                    onChangeName,
                    onViewResponses,
                    transaction,
                    openModal
                  )}</Box>
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
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player, index) => (
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
                        openModal
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
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
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