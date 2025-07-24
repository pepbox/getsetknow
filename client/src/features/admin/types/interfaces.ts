
export interface PlayerTableProps {
    players: Player[];
    gameStatus: boolean;
    onChangeName?: (playerId: string) => void;
    onViewResponses?: (playerId: string) => void;
}

// Type definitions
export interface HeaderData {
    currentLevel: number;
    gameStatus: boolean;
    enableTransactions: boolean;
    adminName?: string;
}

export interface Player {
    id: string;
    name: string;
    questionsAnswered: string;
    currentStatus?: string;
    rank?: number;
    peopleYouKnow?: string;
    peopleWhoKnowYou?: string;
    totalScore?: number;
}

export interface DashboardHeaderProps {
    data: HeaderData;
    gameStatus?: boolean;
    onGameStatusChange?: () => void;
    onTransactionsChange?: (status: boolean) => void;
}


export interface DashboardProps {
    headerData: HeaderData;
    players: Player[];
    onGameStatusChange?: (status: boolean) => void;
    onTransactionsChange?: (status: boolean) => void;
    onChangeName?: (playerId: string) => void;
    onViewResponses?: (playerId: string) => void;
}

// export interface DashboardPageProps {
//   data: {
//     headerData: HeaderData;
//     players: Player[];
//   };
//   handlers?: {
//     onGameStatusChange?: (status: boolean) => void;
//     onTransactionsChange?: (status: boolean) => void;
//     onChangeName?: (playerId: string) => void;
//     onViewResponses?: (playerId: string) => void;
//   };
// }