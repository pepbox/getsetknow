import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SerializedError } from '@reduxjs/toolkit';
import { gameApi, GameCard, Player } from './gameArena.Api';

export interface GuessResult {
  correct: boolean | null;
  guessedPersonId: string;
  actualPersonId?: string;
}

export interface GameArenaState {
  gameCards: GameCard[];
  players: Player[];
  currentCardIndex: number;
  totalScore: number;
  peopleIKnow: number;
  peopleWhoKnowMe: number;
  isLoading: boolean;
  error: SerializedError | null;
  currentGuess: {
    guessId: string | null;
    guessedPersonId: string | null;
  };
  lastGuessResult: GuessResult | null;
  gameCompleted: boolean;
}

const initialState: GameArenaState = {
  gameCards: [],
  players: [],
  currentCardIndex: 0,
  totalScore: 120, // Using dummy data for now
  peopleIKnow: 5,   // Using dummy data for now
  peopleWhoKnowMe: 8, // Using dummy data for now
  isLoading: false,
  error: null,
  currentGuess: {
    guessId: null,
    guessedPersonId: null,
  },
  lastGuessResult: null,
  gameCompleted: false,
};

const gameArenaSlice = createSlice({
  name: 'gameArena',
  initialState,
  reducers: {
    setCurrentGuess: (state, action: PayloadAction<{ guessId: string; guessedPersonId: string }>) => {
      state.currentGuess = action.payload;
    },

    clearCurrentGuess: (state) => {
      state.currentGuess = {
        guessId: null,
        guessedPersonId: null,
      };
    },
    setCurrentCardIndex: (state, action: PayloadAction<number>) => {
      state.currentCardIndex = action.payload;
    },

    nextCard: (state) => {
      if (state.currentCardIndex < state.gameCards.length - 1) {
        state.currentCardIndex += 1;
        state.lastGuessResult = null;
        state.currentGuess = {
          guessId: null,
          guessedPersonId: null,
        };
      } else {
        state.gameCompleted = true;
      }
    },

    replayLastCard: (state) => {
      if (state.currentCardIndex > 0) {
        // state.currentCardIndex -= 1;
        state.lastGuessResult = null;
        state.currentGuess = {
          guessId: null,
          guessedPersonId: null,
        };
        state.gameCompleted = false;
      }
    },

    skipCard: (state) => {
      if (state.currentCardIndex < state.gameCards.length - 1) {
        state.currentCardIndex += 1;
        state.lastGuessResult = null;
        state.currentGuess = {
          guessId: null,
          guessedPersonId: null,
        };
      } else {
        state.gameCompleted = true;
      }
    },

   updateScore: (state, action: PayloadAction<{ correct: boolean }>) => {
      if (action.payload.correct) {
        state.totalScore += 10; // Add points for correct guess
        state.peopleIKnow += 1;
      }
    }, 

    resetGame: (state) => {
      state.currentCardIndex = 0;
      state.lastGuessResult = null;
      state.currentGuess = {
        guessId: null,
        guessedPersonId: null,
      };
      state.gameCompleted = false;
    },

    setGuessResult: (state, action: PayloadAction<GuessResult>) => {
      state.lastGuessResult = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Get Players Cards
      .addMatcher(
        gameApi.endpoints.getPlayersCards.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        gameApi.endpoints.getPlayersCards.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.gameCards = payload;
        }
      )
      .addMatcher(
        gameApi.endpoints.getPlayersCards.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error;
        }
      )

      // Get Players by Session
      .addMatcher(
        gameApi.endpoints.getPlayersBySession.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        gameApi.endpoints.getPlayersBySession.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.players = payload;
        }
      )
      .addMatcher(
        gameApi.endpoints.getPlayersBySession.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error;
        }
      )

      // Submit Guess
      .addMatcher(
        gameApi.endpoints.submitGuess.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        gameApi.endpoints.submitGuess.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;

          // Update score based on result
          if (payload.correct) {
            state.totalScore += 10;
            state.peopleIKnow += 1;
          }

          // Set the guess result
          state.lastGuessResult = {
            correct: payload.correct,
            guessedPersonId: state.currentGuess.guessedPersonId || '',
          };
        }
      )
      .addMatcher(
        gameApi.endpoints.submitGuess.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error;
        }
      )

      .addMatcher(
        gameApi.endpoints.getUserGuesses.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        gameApi.endpoints.getUserGuesses.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.players = payload;
        }
      )
      .addMatcher(
        gameApi.endpoints.getUserGuesses.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error;
        }
      )


  },
});

export const {
  setCurrentGuess,
  clearCurrentGuess,
  nextCard,
  skipCard,
  updateScore,
  resetGame,
  setCurrentCardIndex,
  setGuessResult,
  replayLastCard,
} = gameArenaSlice.actions;

export default gameArenaSlice.reducer;