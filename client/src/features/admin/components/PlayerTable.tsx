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

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  gameStatus,
  onChangeName,
  onViewResponses,
}) => {
  const getRowColor = (index: number) => {
    return index % 2 === 0 ? "#11111108" : "#11111100";
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ borderRadius: 2, overflow: "hidden" }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{color:"black" }}>
            <TableCell sx={{ fontWeight: "bold" }}>
              Player Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Change name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Questions Answered
            </TableCell>
            {gameStatus ? (
              <>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Rank
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  People you know
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  People who know you
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Total Score
                </TableCell>
              </>
            ) : (
              <>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Current Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  View Responses
                </TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player, index) => (
            <TableRow
              key={player.id}
              sx={{ backgroundColor: getRowColor(index) }}
            >
              <TableCell>{player.name}</TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => onChangeName?.(player.id)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </TableCell>
              <TableCell>{player.questionsAnswered}</TableCell>
              {gameStatus ? (
                <>
                  <TableCell>{player.rank}</TableCell>
                  <TableCell>{player.peopleYouKnow}</TableCell>
                  <TableCell>{player.peopleWhoKnowYou}</TableCell>
                  <TableCell>
                    {player.totalScore ? (
                      <Typography fontWeight="medium">
                        {player.totalScore}
                      </Typography>
                    ) : (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => onViewResponses?.(player.id)}
                      >
                        Show
                      </Button>
                    )}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>
                    <Chip
                      label={player.currentStatus || "Pending"}
                      size="small"
                      color={
                        player.currentStatus === "Pending"
                          ? "warning"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => onViewResponses?.(player.id)}
                    >
                      Show
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayerTable;
