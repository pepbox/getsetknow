import React,{ useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { RootState, AppDispatch } from "../../../app/store";
import {
  useGetPlayersCardsQuery,
  useGetPlayersBySessionQuery,
  useSubmitGuessMutation,
  useGetUserGuessesQuery,
} from "../services/gameArena.Api";
import {
  setCurrentGuess,
  clearCurrentGuess,
  nextCard,
  skipCard,
  setGuessResult,
  setCurrentCardIndex,
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
  const [showResult, setShowResult] = useState(false);

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

  // Add this new hook for fetching user guesses
  // const {
  //   data: guessesData,
  //   isLoading: isLoadingGuesses,
  //   error: guessesError,
  // } = useGetUserGuessesQuery({});

  const {
    data: guessesData,
    isLoading: isLoadingGuesses,
    error: guessesError,
  } = useGetUserGuessesQuery(
    {},
    {
      skip: isLoadingCards || !gameCards.length, // <- Important part
    }
  );

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
  const isLoading =
    isLoadingCards ||
    isLoadingPlayers ||
    gameState.isLoading ||
    isLoadingGuesses;
  const error = cardsError || playersError || gameState.error || guessesError;

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
        isLastGuessCorrect: lastGuessResult?.correct ?? undefined,
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

  // Add this new handler for question navigation
  const handleNavigateToQuestion = (questionIndex: number) => {
    // Check if the question is already answered correctly
    const guesses = guessesData?.data || [];
    const targetGuess = guesses[questionIndex];

    if (targetGuess && targetGuess.status === "correct") {
      // Don't allow navigation to correctly answered questions
      return;
    }

    // Navigate to the specific question
    if (questionIndex >= 0 && questionIndex < gameCards.length) {
      // Clear current selection and any guess results when navigating
      dispatch(clearCurrentGuess());
      // dispatch(setGuessResult({ correct: undefined, guessedPersonId: undefined }));

      // Set the current card index to the selected question
      dispatch(setCurrentCardIndex(questionIndex)); // You may need to create this action if it doesn't exist
    }
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
      currentQuestionIndex={currentCardIndex} // Add this prop
      onPersonSelect={handlePersonSelection}
      onSubmitGuess={handleSubmitGuess}
      onNextCard={handleNextCard}
      onSkipCard={handleSkipCard}
      onClearSelection={handleClearSelection}
      onNavigateToQuestion={handleNavigateToQuestion}
      showResult={showResult}
      setShowResult={setShowResult} // Add this prop
      guesses={guessesData?.data || []} // Pass guesses data
    />
  );
};

export default GameArenaPage;
