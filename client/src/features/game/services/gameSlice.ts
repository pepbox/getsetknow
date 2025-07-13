import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, IAnswer, IPlayer, IQuestion } from '../../../types';

const initialState: GameState = {
  players: [],
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  isGameStarted: false,
  currentPlayer: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<IPlayer[]>) => {
      state.players = action.payload;
    },
    setQuestions: (state, action: PayloadAction<IQuestion[]>) => {
      state.questions = action.payload;
    },
    setCurrentPlayer: (state, action: PayloadAction<IPlayer>) => {
      state.currentPlayer = action.payload;
    },
    addAnswer: (state, action: PayloadAction<IAnswer>) => {
      state.answers.push(action.payload);
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
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
  setPlayers,
  setQuestions,
  setCurrentPlayer,
  addAnswer,
  nextQuestion,
  startGame,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;