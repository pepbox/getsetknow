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
}) => {
  const [UpdateSession] = useUpdateSessionMutation();
  const [gameStatus, setGameStatus] = useState<string>("pending");
  const [transaction, setTransaction] = useState<boolean>(false);

  // Dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<boolean>(false);

  useEffect(() => {
    setGameStatus(headerData.gameStatus);
  }, [headerData.gameStatus]);

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
      {transaction ? "Transactions Enabled" : "Transactions Disabled"}
      <DashboardHeader
        data={headerData}
        onGameStatusChange={onGameStatusChange}
        transaction={transaction}
        onTransactionsChange={onTransactionsChange}
      />
      <Box sx={{ px: 10 }}>
        <PlayerTable
          transaction={transaction}
          gameStatus={gameStatus}
          players={players}
          onChangeName={onChangeName}
          onViewResponses={onViewResponses}
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
            color="primary"
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
