
// Admin Login Types
export interface AdminLoginCredentials {
    pin: string;
}

export interface AdminUser {
    id: string;
    name: string;
}

export interface PlayerTableProps {
    players: Player[];
    gameStatus: string;
    transaction?: boolean;
    onChangeName?: (playerId: string,name :string) => void;
    onViewResponses?: (playerId: string) => void;
}

// Type definitions
export interface HeaderData {
    gameStatus: string;
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
    transaction?: boolean;
}


export interface DashboardProps {
    headerData: HeaderData;
    players: Player[];
    onGameStatusChange?: (status: boolean) => void;
    onChangeName?: (playerId: string,name : string) => void;
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