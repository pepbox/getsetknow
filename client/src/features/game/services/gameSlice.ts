import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from '../../../types';
import { gameApi } from './gameArena.Api';

const initialState: GameState = {
  isGameStarted: false,
  currentPlayer: null,
  totalSteps: 0,
  currentStep: 0,
  isLoading: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setTotalSteps: (state, action: PayloadAction<number>) => {
      state.totalSteps = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    startGame: (state) => {
      state.isGameStarted = true;
    },
    resetGame: (_state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        gameApi.endpoints.getSession.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        gameApi.endpoints.getSession.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.isGameStarted = payload.status === 'playing';
        }
      )
      .addMatcher(
        gameApi.endpoints.getSession.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error;
        }
      )
  },
});

export const {
  setTotalSteps,
  setCurrentStep,
  startGame,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;