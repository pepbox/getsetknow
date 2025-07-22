import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from '../../../types';

const initialState: GameState = {
  isGameStarted: false,
  currentPlayer: null,
  totalSteps: 0,
  currentStep: 0,
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
});

export const {
  setTotalSteps,
  setCurrentStep,
  startGame,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;