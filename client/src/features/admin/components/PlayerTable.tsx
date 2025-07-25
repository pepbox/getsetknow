import { Edit as EditIcon } from "@mui/icons-material";
import {
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { PlayerTableProps } from "../types/interfaces";

type Column = {
  key: string;
  label: string;
  visible: (gameStatus: string) => boolean;
  render: (
    player: any,
    onChangeName?: (id: string,name : string) => void,
    onViewResponses?: (id: string) => void,
    transaction?: boolean
  ) => React.ReactNode;
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
    render: (player, onChangeName, _, transaction) => (
      <IconButton
        size="small"
        disabled={!transaction}
        onClick={() => onChangeName?.(player.id,"sdmn")}
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
    render: (player, _onChangeName, onViewResponses) => (
      <Button
        variant="text"
        size="small"
        onClick={() => onViewResponses?.(player.id)}
      >
        Show
      </Button>
    ),
  },
];

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  gameStatus,
  transaction,
  onChangeName,
  onViewResponses,
}) => {
  const getRowColor = (index: number) =>
    index % 2 === 0 ? "#11111108" : "#11111100";

  const visibleColumns = columns.filter((col) => col.visible(gameStatus));

  return (
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
                    transaction
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayerTable;
