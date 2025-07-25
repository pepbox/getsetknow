import { api } from "../../../app/api";

export interface GameCard {
  guessId: string;
  guessedPersonId?: string;
  responses: Record<string, string>; // keyAspect -> response mapping
}

export interface Player {
  _id: string;
  name: string;
  profilePhoto?: string;
}

export interface GuessSubmissionResponse {
  success: boolean;
  correct: boolean;
}

export const gameApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlayersCards: builder.query<GameCard[], void>({
      query: () => ({
        url: '/player/getPlayersCards',
        method: 'GET',
      }),
      transformResponse: (response: { data: GameCard[] }) => response.data,
      // providesTags: ['GameCards'],
    }),

    getPlayersBySession: builder.query<Player[], void>({
      query: () => ({
        url: '/player/getPlayersBySession',
        method: 'GET',
      }),
      transformResponse: (response: { data: Player[] }) => response.data,
      //   providesTags: ['Players'],
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

  }),
});

export const {
  useGetPlayersCardsQuery,
  useGetPlayersBySessionQuery,
  useSubmitGuessMutation,
  useGetUserGuessesQuery,
  useGetPlayerStatsQuery,
} = gameApi;