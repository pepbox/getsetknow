import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { RootState, AppDispatch } from "../../../app/store";
import {
  useGetPlayersCardsQuery,
  useGetPlayersBySessionQuery,
  useSubmitGuessMutation,
} from "../services/gameArena.Api";
import {
  setCurrentGuess,
  clearCurrentGuess,
  nextCard,
  skipCard,
  setGuessResult,
} from "../services/gameArenaSlice";
import GameArena from "../components/GameArena";

export interface GameArenaData {
  totalScore: number;
  peopleIKnow: number;
  peopleWhoKnowMe: number;
  profile: Record<string, string>;
  players: Array<{
    _id: string;
    name: string;
    profilePhoto?: string;
  }>;
  currentGuessId: string;
  isLastGuessCorrect?: boolean;
  gameCompleted: boolean;
}

const GameArenaPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // RTK Query hooks
  const {
    data: gameCards = [],
    isLoading: isLoadingCards,
    error: cardsError,
  } = useGetPlayersCardsQuery();

  const {
    data: players = [],
    isLoading: isLoadingPlayers,
    error: playersError,
  } = useGetPlayersBySessionQuery();

  const [submitGuess] = useSubmitGuessMutation();

  // Redux state
  const gameState = useSelector((state: RootState) => state.gameArena);
  const {
    currentCardIndex,
    totalScore,
    peopleIKnow,
    peopleWhoKnowMe,
    currentGuess,
    lastGuessResult,
    gameCompleted,
  } = gameState;

  // Loading and error states
  const isLoading = isLoadingCards || isLoadingPlayers || gameState.isLoading;
  const error = cardsError || playersError || gameState.error;

  // Get current card data
  const currentCard = gameCards[currentCardIndex];
  const progressValue =
    gameCards.length > 0
      ? ((currentCardIndex + 1) / gameCards.length) * 100
      : 0;

  // Transform backend data to match GameArena component expectations
  const gameArenaData: GameArenaData | null = currentCard
    ? {
        totalScore,
        peopleIKnow,
        peopleWhoKnowMe,
        profile: currentCard.responses,
        players: players.map((player) => ({
          _id: player._id,
          name: player.name,
          profilePhoto: player.profilePhoto,
        })),
        currentGuessId: currentCard.guessId,
        isLastGuessCorrect: lastGuessResult?.correct,
        gameCompleted,
      }
    : null;

  // Handlers
  const handlePersonSelection = (personId: string) => {
    if (currentCard) {
      dispatch(
        setCurrentGuess({
          guessId: currentCard.guessId,
          guessedPersonId: personId,
        })
      );
    }
  };

  const handleSubmitGuess = async () => {
    if (currentGuess.guessId && currentGuess.guessedPersonId) {
      try {
        const result = await submitGuess({
          guessId: currentGuess.guessId,
          guessedPersonId: currentGuess.guessedPersonId,
        }).unwrap();

        dispatch(
          setGuessResult({
            correct: result.correct,
            guessedPersonId: currentGuess.guessedPersonId,
          })
        );
      } catch (error) {
        console.error("Error submitting guess:", error);
      }
    }
  };

  const handleNextCard = () => {
    dispatch(nextCard());
  };

  const handleSkipCard = () => {
    dispatch(skipCard());
  };

  const handleClearSelection = () => {
    dispatch(clearCurrentGuess());
  };

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading game data...</Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Error loading game data:{" "}
          {typeof error === "string"
            ? error
            : error && typeof error === "object"
            ? JSON.stringify(error)
            : "Unknown error"}
        </Alert>
      </Box>
    );
  }

  // No data state
  if (!gameArenaData) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">No game data available</Alert>
      </Box>
    );
  }

  return (
    <GameArena
      data={gameArenaData}
      progressValue={progressValue}
      selectedPersonId={currentGuess.guessedPersonId}
      onPersonSelect={handlePersonSelection}
      onSubmitGuess={handleSubmitGuess}
      onNextCard={handleNextCard}
      onSkipCard={handleSkipCard}
      onClearSelection={handleClearSelection}
    />
  );
};

export default GameArenaPage;
