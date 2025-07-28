import React, { useEffect, useState } from "react";
import { DashboardProps } from "../types/interfaces";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DashboardHeader from "./DashboardHeader";
import PlayerTable from "./PlayerTable";
import { useUpdateSessionMutation } from "../services/admin.Api";

const Dashboard: React.FC<DashboardProps> = ({
  headerData,
  players,
  onChangeName,
  onViewResponses,
  playerWithResponses = null, 
}) => {
  const [UpdateSession] = useUpdateSessionMutation();
  const [gameStatus, setGameStatus] = useState<string>("pending");
  const [transaction, setTransaction] = useState<boolean>(false);

  // Dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<boolean>(false);

  useEffect(() => {
    setGameStatus(headerData?.gameStatus);
  }, [headerData?.gameStatus]);

  const onGameStatusChange = () => {
    console.log("Game status changed:", !gameStatus);
    UpdateSession({ status: "playing" })
      .unwrap()
      .then(() => {
        setGameStatus("playing");
        console.log("Session updated successfully");
      })
      .catch((error) => {
        console.error("Failed to update session:", error);
      });
  };

  const onTransactionsChange = (status: boolean) => {
    setPendingTransaction(status);
    setConfirmDialogOpen(true);
  };

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleDialogConfirm = () => {
    setTransaction(pendingTransaction);
    setConfirmDialogOpen(false);
  };

  return (
    <Box sx={{ py: 3 }}>
      <DashboardHeader
        data={headerData}
        onGameStatusChange={onGameStatusChange}
        transaction={transaction}
        onTransactionsChange={onTransactionsChange}
      />
      <Box sx={{ px: 4 }}>
        <PlayerTable
          players={players}
          gameStatus={gameStatus}
          transaction={transaction}
          onChangeName={onChangeName}
          onViewResponses={onViewResponses}
          playerWithResponses={playerWithResponses}
        />
      </Box>
      <Dialog open={confirmDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Transaction Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {pendingTransaction ? "enable" : "disable"}{" "}
            transactions?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDialogConfirm}
            color="secondary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
