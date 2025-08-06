import { api } from "../../../app/api";

export interface GameCard {
  guessId: string;
  guessedPersonId?: string;
  responses: Record<string, string>;
}

export interface Player {
  _id: string;
  name: string;
  profilePhoto?: string;
  score?: number;
}

export interface GuessSubmissionResponse {
  success: boolean;
  correct: boolean;
  profilePhoto?: string;
  name?: string;
  attempts?: number;
  score?: number;
}

export interface Session {
  _id: string;
  name: string;
  status?: string;
}

export interface GameCompletionData {
  currentPlayer: {
    _id: string;
    name: string;
    profilePhoto?: string;
    score: number;
  };
  peopleYouKnow: Player[];
  peopleWhoKnowYou: Player[];
  totalPlayers: number;
}

export interface SelfieSubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    guessId: string;
    selfieUrl?: string;
  };
}

export const gameApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlayersCards: builder.query<GameCard[], void>({
      query: () => ({
        url: '/player/getPlayersCards',
        method: 'GET',
      }),
      transformResponse: (response: { data: GameCard[] }) => response.data,
    }),

    getPlayersBySession: builder.query<Player[], void>({
      query: () => ({
        url: '/player/getPlayersBySession',
        method: 'GET',
      }),
      transformResponse: (response: { data: Player[] }) => response.data,
    }),

    submitGuess: builder.mutation<GuessSubmissionResponse, { guessId: string; guessedPersonId: string }>({
      query: (body) => ({
        url: '/player/submitGuess',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['GameCards'],
    }),

    getUserGuesses: builder.query({
      query: () => ({
        url: '/player/getUserGuesses',
        method: 'GET',
      }),
      // transformResponse: (response: { data: Player[] }) => response.data,
      providesTags: ['GameCards'],
    }),

    getPlayerStats: builder.query<any, void>({
      query: () => ({
        url: '/player/getPlayerStats',
        method: 'GET',
      }),
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ['GameCards'],
    }),

    getSession: builder.query<Session, void>({
      query: () => ({
        url: '/session/getSession',
        method: 'GET',
      }),
      transformResponse: (response: { data: Session }) => response.data,
      providesTags: ["GameSession"],
    }),

    getGameCompletionData: builder.query<GameCompletionData, void>({
      query: () => ({
        url: '/player/getGameCompletionData',
        method: 'GET',
      }),
      transformResponse: (response: { data: GameCompletionData }) => response.data,
    }),

    submitSelfie: builder.mutation<SelfieSubmissionResponse, FormData>({
      query: (formData) => ({
        url: '/player/submitSelfie',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['GameCards'],
    }),
  }),
});

export const {
  useGetPlayersCardsQuery,
  useGetPlayersBySessionQuery,
  useSubmitGuessMutation,
  useGetUserGuessesQuery,
  useGetPlayerStatsQuery,
  useGetSessionQuery,
  useGetGameCompletionDataQuery,
  useSubmitSelfieMutation,
} = gameApi;