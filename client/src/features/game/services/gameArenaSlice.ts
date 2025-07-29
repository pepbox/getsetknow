import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SerializedError } from '@reduxjs/toolkit';
import { gameApi, GameCard, Player } from './gameArena.Api';

export interface GuessResult {
  correct: boolean | null;
  guessedPersonId: string;
  actualPersonId?: string;
  profilePhoto?: string;
  name?: string;
  attempts?: number;
  score?: number;
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
  correctlyGuessedCards: string[]; // Array of guessIds that have been correctly guessed
}

const initialState: GameArenaState = {
  gameCards: [],
  players: [],
  currentCardIndex: 0,
  totalScore: 0,
  peopleIKnow: 0,
  peopleWhoKnowMe: 0,
  isLoading: false,
  error: null,
  currentGuess: {
    guessId: null,
    guessedPersonId: null,
  },
  lastGuessResult: null,
  gameCompleted: false,
  correctlyGuessedCards: [],
};

// Helper function to find next unguessed card
const findNextUnguessedCard = (
  currentIndex: number,
  gameCards: GameCard[],
  correctlyGuessedCards: string[]
): number => {
  const totalCards = gameCards.length;

  // Start searching from the next card after current
  for (let i = 1; i <= totalCards; i++) {
    const nextIndex = (currentIndex + i) % totalCards;
    const nextCard = gameCards[nextIndex];

    if (nextCard && !correctlyGuessedCards.includes(nextCard.guessId)) {
      return nextIndex;
    }
  }

  return currentIndex;
};

// Helper function to check if all cards are correctly guessed
const areAllCardsGuessed = (
  gameCards: GameCard[],
  correctlyGuessedCards: string[]
): boolean => {
  return gameCards.length > 0 && gameCards.every(card =>
    correctlyGuessedCards.includes(card.guessId)
  );
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
      // Check if all cards are correctly guessed
      if (areAllCardsGuessed(state.gameCards, state.correctlyGuessedCards)) {
        state.gameCompleted = true;
        return;
      }

      // Find next unguessed card
      const nextIndex = findNextUnguessedCard(
        state.currentCardIndex,
        state.gameCards,
        state.correctlyGuessedCards
      );

      if (nextIndex !== state.currentCardIndex) {
        state.currentCardIndex = nextIndex;
        // state.lastGuessResult = null;
        state.currentGuess = {
          guessId: null,
          guessedPersonId: null,
        };
      } else {
        // If we can't find any unguessed card, game is completed
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
      // Check if all cards are correctly guessed
      if (areAllCardsGuessed(state.gameCards, state.correctlyGuessedCards)) {
        state.gameCompleted = true;
        return;
      }

      // Find next unguessed card
      const nextIndex = findNextUnguessedCard(
        state.currentCardIndex,
        state.gameCards,
        state.correctlyGuessedCards
      );

      if (nextIndex !== state.currentCardIndex) {
        state.currentCardIndex = nextIndex;
        state.lastGuessResult = null;
        state.currentGuess = {
          guessId: null,
          guessedPersonId: null,
        };
      } else {

        // If we can't find any unguessed card, game is completed
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
      state.correctlyGuessedCards = [];
    },

    setGuessResult: (state, action: PayloadAction<GuessResult>) => {
      state.lastGuessResult = action.payload;

      // If the guess is correct, add the guessId to correctly guessed cards
      if (action.payload.correct && action.payload.guessedPersonId) {
        const currentCard = state.gameCards[state.currentCardIndex];
        if (currentCard && !state.correctlyGuessedCards.includes(currentCard.guessId)) {
          state.correctlyGuessedCards.push(currentCard.guessId);
        }
      }
    },

    jumpToUnguessedCard: (state, action: PayloadAction<number>) => {
      const targetIndex = action.payload;
      if (targetIndex >= 0 && targetIndex < state.gameCards.length) {
        const targetCard = state.gameCards[targetIndex];
        // Only allow navigation to unguessed cards
        if (targetCard && !state.correctlyGuessedCards.includes(targetCard.guessId)) {
          state.currentCardIndex = targetIndex;
          state.lastGuessResult = null;
          state.currentGuess = {
            guessId: null,
            guessedPersonId: null,
          };
          state.gameCompleted = false;
        }
      }
    },

    initializeCorrectlyGuessedCards: (state, action: PayloadAction<string[]>) => {
      state.correctlyGuessedCards = action.payload;
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
          state.gameCompleted = areAllCardsGuessed(payload, state.correctlyGuessedCards);
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

          if (payload.correct) {
            state.totalScore += 100;
            state.peopleIKnow += 1;

            // Add to correctly guessed cards
            const currentCard = state.gameCards[state.currentCardIndex];
            if (currentCard && !state.correctlyGuessedCards.includes(currentCard.guessId)) {
              state.correctlyGuessedCards.push(currentCard.guessId);
            }
          }
          // Set the guess result with additional data
          state.lastGuessResult = {
            correct: payload.correct,
            guessedPersonId: state.currentGuess.guessedPersonId || '',
            profilePhoto: payload.profilePhoto,
            name: payload.name,
            attempts: payload.attempts || 0,
            score: payload.score || 0,
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

      .addMatcher(
        gameApi.endpoints.getPlayerStats.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        gameApi.endpoints.getPlayerStats.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.totalScore = payload.totalScore || 0;
          state.peopleIKnow = payload.peopleIKnow || 0;
          state.peopleWhoKnowMe = payload.peopleWhoKnowMe || 0;
        }
      )
      .addMatcher(
        gameApi.endpoints.getPlayerStats.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error;
        }
      );
    builder
      .addMatcher(gameApi.endpoints.getSession.matchPending, () => {
      })
      .addMatcher(
        gameApi.endpoints.getSession.matchFulfilled,
        (state, { payload }) => {
          state.gameCompleted = payload.status === 'ended';
        }
      )
      .addMatcher(
        gameApi.endpoints.getSession.matchRejected,
        () => {
        }
      );


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
  jumpToUnguessedCard,
  initializeCorrectlyGuessedCards,
} = gameArenaSlice.actions;

export default gameArenaSlice.reducer;