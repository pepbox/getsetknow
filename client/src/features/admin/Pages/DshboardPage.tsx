import React from "react";
import Dashboard from "../components/Dashboard";

const DashboardPage: React.FC = () => {
  return (
    <Dashboard
      headerData={data.headerData}
      players={data.players}
      onTransactionsChange={handlers?.onTransactionsChange}
      onChangeName={handlers?.onChangeName}
      onViewResponses={handlers?.onViewResponses}
    />
  );
};

// Demo with dummy data
const data = {
  headerData: {
    currentLevel: 1,
    gameStatus: false,
    enableTransactions: false,
    adminName: "Udhay Pareek",
  },
  players: [
    {
      id: "1",
      name: "Shalini Sharma",
      questionsAnswered: "2/8",
      currentStatus: "Pending",
      rank: 5,
      peopleYouKnow: "2/8",
      peopleWhoKnowYou: "2/8",
      totalScore: 120,
    },
    {
      id: "2",
      name: "Shalini Sharma",
      questionsAnswered: "2/8",
      currentStatus: "Pending",
      rank: 2,
      peopleYouKnow: "2/8",
      peopleWhoKnowYou: "2/8",
      totalScore: 140,
    },
    {
      id: "3",
      name: "Shalini Sharma",
      questionsAnswered: "2/8",
      currentStatus: "Pending",
      rank: 8,
      peopleYouKnow: "2/8",
      peopleWhoKnowYou: "2/8",
      totalScore: 60,
    },
    {
      id: "4",
      name: "Shalini Sharma",
      questionsAnswered: "2/8",
      currentStatus: "Pending",
      rank: 4,
      peopleYouKnow: "2/8",
      peopleWhoKnowYou: "2/8",
      totalScore: 80,
    },
    {
      id: "5",
      name: "Shalini Sharma",
      questionsAnswered: "2/8",
      currentStatus: "Pending",
      rank: 3,
      peopleYouKnow: "2/8",
      peopleWhoKnowYou: "2/8",
      totalScore: 100,
    },
    {
      id: "6",
      name: "Shalini Sharma",
      questionsAnswered: "2/8",
      currentStatus: "Pending",
      rank: 10,
      peopleYouKnow: "2/8",
      peopleWhoKnowYou: "5/8",
      totalScore: 20,
    },
    {
      id: "7",
      name: "Shalini Sharma",
      questionsAnswered: "2/8",
      currentStatus: "Pending",
      rank: 11,
      peopleYouKnow: "2/8",
      peopleWhoKnowYou: "2/8",
      totalScore: 20,

    },
    {
      id: "8",
      name: "Shalini Sharma",
      questionsAnswered: "2/8",
      currentStatus: "Pending",
      rank: 7,
      peopleYouKnow: "2/8",
      peopleWhoKnowYou: "2/8",
      totalScore: 40,
    },
  ],
};

// Demo handlers
const handlers = {

  onTransactionsChange: (status: boolean) => {
    console.log("Transactions status changed:", status);
  },
  onChangeName: (playerId: string) => {
    console.log("Change name for player:", playerId);
  },
  onViewResponses: (playerId: string) => {
    console.log("View responses for player:", playerId);
  },
};

export default DashboardPage;
