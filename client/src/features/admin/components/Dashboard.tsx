import React, {  useState } from "react";
import { DashboardProps } from "../types/interfaces";
import { Box } from "@mui/material";
import DashboardHeader from "./DashboardHeader";
import PlayerTable from "./PlayerTable";

const Dashboard: React.FC<DashboardProps> = ({
  headerData,
  players,
  //   onGameStatusChange,
  onTransactionsChange,
  onChangeName,
  onViewResponses,
}) => {
  const [gameStatus, setGameStatus] = useState<boolean>(false);
  const onGameStatusChange = () => {
    console.log("Game status changed:", !gameStatus);
    setGameStatus(!gameStatus);
  };

  return (
    <Box sx={{ py: 3 }}>
      <DashboardHeader
        data={headerData}
        gameStatus={gameStatus}
        onGameStatusChange={onGameStatusChange}
        onTransactionsChange={onTransactionsChange}
      />
      <Box sx={{ px: 10 }}>
        <PlayerTable
          gameStatus={gameStatus}  
          players={players}
          onChangeName={onChangeName}
          onViewResponses={onViewResponses}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
