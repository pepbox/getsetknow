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

export interface PendingSelfieData {
  guessId: string;
  lastGuessPlayerPhoto?: string;
  lastGuessPlayerName?: string;
  lastGuessAttempts?: number;
  lastGuessScore?: number;
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
  correctlyGuessedCards: string[];
  showSelfieUpload: boolean;
  currentSelfieGuessId: string | null;
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
  showSelfieUpload: false,
  currentSelfieGuessId: null,
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
      }
      // else {
      //   // If we can't find any unguessed card, game is completed
      //   console.log("All cards guessed, game completed ate next card 2 ");
      //   state.gameCompleted = true;
      // }
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
      }
      // else {

      //   // If we can't find any unguessed card, game is completed
      //   state.gameCompleted = true;
      // }
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
        state.showSelfieUpload = true;
        state.currentSelfieGuessId = currentCard.guessId;
        
        // Store complete selfie data in localStorage for persistence across refreshes
        if (typeof window !== 'undefined') {
          const pendingSelfieData: PendingSelfieData = {
            guessId: currentCard.guessId,
            lastGuessPlayerPhoto: action.payload.profilePhoto,
            lastGuessPlayerName: action.payload.name,
            lastGuessAttempts: action.payload.attempts,
            lastGuessScore: action.payload.score,
          };
          localStorage.setItem('pendingSelfieData', JSON.stringify(pendingSelfieData));
        }
        
        if (currentCard && !state.correctlyGuessedCards.includes(currentCard.guessId)) {
          state.correctlyGuessedCards.push(currentCard.guessId);
          // If guess is correct, show selfie upload screen
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

    // Selfie-related actions
    showSelfieUploadScreen: (state, action: PayloadAction<{ 
      guessId: string;
      lastGuessPlayerPhoto?: string;
      lastGuessPlayerName?: string;
      lastGuessAttempts?: number;
      lastGuessScore?: number;
    }>) => {
      state.showSelfieUpload = true;
      state.currentSelfieGuessId = action.payload.guessId;
      
      // Store complete selfie data in localStorage as backup for page refresh
      if (typeof window !== 'undefined') {
        const pendingSelfieData: PendingSelfieData = {
          guessId: action.payload.guessId,
          lastGuessPlayerPhoto: action.payload.lastGuessPlayerPhoto,
          lastGuessPlayerName: action.payload.lastGuessPlayerName,
          lastGuessAttempts: action.payload.lastGuessAttempts,
          lastGuessScore: action.payload.lastGuessScore,
        };
        localStorage.setItem('pendingSelfieData', JSON.stringify(pendingSelfieData));
      }
    },

    hideSelfieUploadScreen: (state) => {
      state.showSelfieUpload = false;
      state.currentSelfieGuessId = null;
      
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pendingSelfieData');
        localStorage.removeItem('pendingSelfieGuessId'); // Remove old key for backwards compatibility
      }
    },

    setSelfieUploaded: (state, action: PayloadAction<{ guessId: string }>) => {
      // Mark selfie as uploaded for this guess
      state.showSelfieUpload = false;
      state.currentSelfieGuessId = null;

      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pendingSelfieData');
        localStorage.removeItem('pendingSelfieGuessId'); // Remove old key for backwards compatibility
      }

      // Find and update the corresponding game card if needed
      const currentCard = state.gameCards[state.currentCardIndex];
      if (currentCard && currentCard.guessId === action.payload.guessId) {
        // The selfie has been uploaded, user can now proceed to next card
      }
    },

    // New action to restore selfie screen with complete data from localStorage
    restoreSelfieScreenData: (state, action: PayloadAction<PendingSelfieData>) => {
      const { guessId, lastGuessPlayerPhoto, lastGuessPlayerName, lastGuessAttempts, lastGuessScore } = action.payload;
      
      state.showSelfieUpload = true;
      state.currentSelfieGuessId = guessId;
      
      // Restore the lastGuessResult with the stored data
      state.lastGuessResult = {
        correct: true,
        guessedPersonId: '', // We don't need this for the selfie screen
        profilePhoto: lastGuessPlayerPhoto,
        name: lastGuessPlayerName,
        attempts: lastGuessAttempts,
        score: lastGuessScore,
      };
    },

    // New action to check for pending selfies on page load
    checkForPendingSelfies: (state, action: PayloadAction<{ 
      guessesData: any[], 
      gameCards: GameCard[], 
      currentCardIndex: number,
      players?: Player[] // Add players to help find missing data
    }>) => {
      const { guessesData, gameCards, currentCardIndex, players = [] } = action.payload;
      
      // Check localStorage for pending selfie data as fallback
      let pendingSelfieData: PendingSelfieData | null = null;
      let pendingSelfieGuessId: string | null = null; // For backwards compatibility
      
      if (typeof window !== 'undefined') {
        // Try new format first
        const storedData = localStorage.getItem('pendingSelfieData');
        if (storedData) {
          try {
            pendingSelfieData = JSON.parse(storedData);
          } catch (e) {
            console.warn('Failed to parse pendingSelfieData from localStorage');
          }
        }
        
        // Fallback to old format for backwards compatibility
        if (!pendingSelfieData) {
          pendingSelfieGuessId = localStorage.getItem('pendingSelfieGuessId');
          if (pendingSelfieGuessId) {
            pendingSelfieData = { guessId: pendingSelfieGuessId };
          }
        }
      }
      
      if (guessesData && gameCards.length > 0) {
        // First check if we have a pending selfie from localStorage
        if (pendingSelfieData) {
          const cardWithPendingSelfie = gameCards.find(card => card.guessId === pendingSelfieData!.guessId);
          if (cardWithPendingSelfie) {
            const cardIndex = gameCards.indexOf(cardWithPendingSelfie);
            const guess = guessesData.find((g: any) => g.guessId === pendingSelfieData!.guessId);
            
            // Verify it still requires selfie
            if (guess?.requiresSelfie) {
              // Only change currentCardIndex if it's different
              if (state.currentCardIndex !== cardIndex) {
                state.currentCardIndex = cardIndex;
              }
              state.showSelfieUpload = true;
              state.currentSelfieGuessId = pendingSelfieData.guessId;
              state.currentGuess = {
                guessId: null,
                guessedPersonId: null,
              };
              
              // If we have stored player data, restore it
              if (pendingSelfieData.lastGuessPlayerPhoto || pendingSelfieData.lastGuessPlayerName) {
                state.lastGuessResult = {
                  correct: true,
                  guessedPersonId: '',
                  profilePhoto: pendingSelfieData.lastGuessPlayerPhoto,
                  name: pendingSelfieData.lastGuessPlayerName,
                  attempts: pendingSelfieData.lastGuessAttempts,
                  score: pendingSelfieData.lastGuessScore,
                };
              } else if (guess?.guessedPersonId && players.length > 0) {
                // Try to find player data from the players array
                const guessedPlayer = players.find(p => p._id === guess.guessedPersonId);
                if (guessedPlayer) {
                  state.lastGuessResult = {
                    correct: true,
                    guessedPersonId: guess.guessedPersonId,
                    profilePhoto: guessedPlayer.profilePhoto,
                    name: guessedPlayer.name,
                    attempts: 1,
                    score: 100,
                  };
                  
                  // Update localStorage with the found data
                  const updatedSelfieData: PendingSelfieData = {
                    ...pendingSelfieData,
                    lastGuessPlayerPhoto: guessedPlayer.profilePhoto,
                    lastGuessPlayerName: guessedPlayer.name,
                    lastGuessAttempts: 1,
                    lastGuessScore: 100,
                  };
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('pendingSelfieData', JSON.stringify(updatedSelfieData));
                  }
                }
              }
              return;
            } else {
              // Clear localStorage if selfie no longer required
              localStorage.removeItem('pendingSelfieData');
              localStorage.removeItem('pendingSelfieGuessId');
            }
          }
        }

        // Check the current card
        const currentCard = gameCards[currentCardIndex];
        if (currentCard) {
          const currentGuess = guessesData.find(
            (guess: any) => guess.guessId === currentCard.guessId
          );

          if (currentGuess?.requiresSelfie) {
            state.showSelfieUpload = true;
            state.currentSelfieGuessId = currentCard.guessId;
            // Note: lastGuessResult should already be available from API or previous state
            return;
          }
        }

        // If no selfie required for current card, check all cards for any pending selfies
        // Start from current index and wrap around to find the next pending selfie
        let foundPendingSelfie = false;
        for (let i = 0; i < gameCards.length; i++) {
          const cardIndex = (currentCardIndex + i) % gameCards.length;
          const card = gameCards[cardIndex];
          const guess = guessesData.find((g: any) => g.guessId === card.guessId);
          
          if (guess?.requiresSelfie) {
            // Found a card that requires selfie, navigate to it only if different
            if (state.currentCardIndex !== cardIndex) {
              state.currentCardIndex = cardIndex;
            }
            state.showSelfieUpload = true;
            state.currentSelfieGuessId = card.guessId;
            // Clear any previous guess state
            state.currentGuess = {
              guessId: null,
              guessedPersonId: null,
            };
            foundPendingSelfie = true;
            break;
          }
        }

        // If no pending selfies found, ensure selfie screen is hidden and clear localStorage
        if (!foundPendingSelfie && state.showSelfieUpload) {
          state.showSelfieUpload = false;
          state.currentSelfieGuessId = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('pendingSelfieData');
            localStorage.removeItem('pendingSelfieGuessId');
          }
        }
      }
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
  showSelfieUploadScreen,
  hideSelfieUploadScreen,
  setSelfieUploaded,
  checkForPendingSelfies,
  restoreSelfieScreenData,
} = gameArenaSlice.actions;

export default gameArenaSlice.reducer;