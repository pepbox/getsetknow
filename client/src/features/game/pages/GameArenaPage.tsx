import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Alert } from "@mui/material";
import { RootState, AppDispatch } from "../../../app/store";
import {
  useGetPlayersCardsQuery,
  useGetPlayersBySessionQuery,
  useSubmitGuessMutation,
  useGetUserGuessesQuery,
  useGetPlayerStatsQuery,
} from "../services/gameArena.Api";
import {
  setCurrentGuess,
  clearCurrentGuess,
  nextCard,
  skipCard,
  setGuessResult,
  jumpToUnguessedCard,
  initializeCorrectlyGuessedCards,
  checkForPendingSelfies,
  restoreSelfieScreenData,
} from "../services/gameArenaSlice";
import GameArena from "../components/GameArena";
import Loader from "../../../components/ui/Loader";
import { useAppSelector } from "../../../app/hooks";
import { Navigate } from "react-router-dom";

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
  lastGuessPlayerPhoto?: string;
  lastGuessPlayerName?: string;
  lastGuessAttempts?: number;
  lastGuessScore?: number;
}

const GameArenaPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showResult, setShowResult] = useState(false);
  const { isGameStarted } = useAppSelector((state: RootState) => state.game);
  const hasCheckedPendingSelfies = useRef(false);

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

  useGetPlayerStatsQuery();

  const {
    data: guessesData,
    isLoading: isLoadingGuesses,
    error: guessesError,
  } = useGetUserGuessesQuery(
    {},
    {
      skip: isLoadingCards || !gameCards.length,
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
    correctlyGuessedCards,
    showSelfieUpload,
  } = gameState;

  // Auto-navigate to unguessed card when current card is already guessed
  useEffect(() => {
    const currentCard = gameCards[currentCardIndex];
    if (
      currentCard &&
      correctlyGuessedCards.includes(currentCard.guessId) &&
      !gameCompleted &&
      !showSelfieUpload // Don't auto-navigate if selfie upload is required
    ) {
      dispatch(nextCard());
    }
  }, [
    currentCardIndex,
    gameCards,
    correctlyGuessedCards,
    gameCompleted,
    showSelfieUpload,
    dispatch,
  ]);

  // Initialize correctly guessed cards from backend data
  useEffect(() => {
    if (guessesData?.data && gameCards.length > 0) {
      const correctGuessIds = guessesData.data
        .filter((guess: any) => guess.status === "correct")
        .map((guess: any) => guess.guessId)
        .filter((id: string) => id);

      const sortedCorrectGuessIds = [...correctGuessIds].sort();
      const sortedCurrentlyGuessedCards = [...correctlyGuessedCards].sort();

      if (
        JSON.stringify(sortedCorrectGuessIds) !==
        JSON.stringify(sortedCurrentlyGuessedCards)
      ) {
        dispatch(initializeCorrectlyGuessedCards(correctGuessIds));
      }
    }
  }, [guessesData, gameCards, correctlyGuessedCards, dispatch]);

  // Initial check for pending selfies on page load (handles refresh scenarios)
  useEffect(() => {
    if (guessesData?.data && gameCards.length > 0 && !isLoadingCards && !isLoadingGuesses && !hasCheckedPendingSelfies.current) {
      // Check for any pending selfies on initial load
      hasCheckedPendingSelfies.current = true;
      dispatch(checkForPendingSelfies({
        guessesData: guessesData.data,
        gameCards,
        currentCardIndex,
        players
      }));
    }
  }, [guessesData?.data, gameCards, isLoadingCards, isLoadingGuesses, dispatch]);

  // Fallback: Check localStorage for pending selfie on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && gameCards.length > 0) {
      // Try new format first
      const storedData = localStorage.getItem('pendingSelfieData');
      let pendingSelfieData = null;
      
      if (storedData) {
        try {
          pendingSelfieData = JSON.parse(storedData);
        } catch (e) {
          console.warn('Failed to parse pendingSelfieData from localStorage');
        }
      }
      
      // Fallback to old format for backwards compatibility
      if (!pendingSelfieData) {
        const pendingSelfieGuessId = localStorage.getItem('pendingSelfieGuessId');
        if (pendingSelfieGuessId) {
          pendingSelfieData = { guessId: pendingSelfieGuessId };
        }
      }
      
      if (pendingSelfieData) {
        const cardWithPendingSelfie = gameCards.find(card => card.guessId === pendingSelfieData.guessId);
        if (cardWithPendingSelfie) {
          const cardIndex = gameCards.indexOf(cardWithPendingSelfie);
          // Navigate to the card with pending selfie and restore data
          dispatch(jumpToUnguessedCard(cardIndex));
          if (pendingSelfieData.lastGuessPlayerPhoto || pendingSelfieData.lastGuessPlayerName) {
            dispatch(restoreSelfieScreenData(pendingSelfieData));
          }
        }
      }
    }
  }, [gameCards, dispatch]);

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
      ? (correctlyGuessedCards.length / gameCards.length) * 100
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
        lastGuessPlayerPhoto: lastGuessResult?.profilePhoto,
        lastGuessPlayerName: lastGuessResult?.name,
        lastGuessAttempts: lastGuessResult?.attempts,
        lastGuessScore: lastGuessResult?.score || 0,
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
            profilePhoto: result.profilePhoto,
            name: result.name,
            attempts: result.attempts,
            score: result.score,
          })
        );

        // Refetch user guesses to get updated attempt count for wrong guesses
        if (!result.correct) {
          // Wait a bit for the backend to update, then refetch
          setTimeout(() => {
            // This will trigger a refetch due to invalidated tags
          }, 100);
        }
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
    // Check if the question is already answered correctly using our local state
    const targetCard = gameCards[questionIndex];
    if (targetCard && correctlyGuessedCards.includes(targetCard.guessId)) {
      // Don't allow navigation to correctly answered questions
      return;
    }

    // Use the new jumpToUnguessedCard action
    dispatch(jumpToUnguessedCard(questionIndex));
  };

  // Extract correctly guessed player IDs from guesses data
  const getCorrectlyGuessedPlayerIds = (): string[] => {
    if (!guessesData?.data || !gameCards.length) return [];

    const correctPlayerIds: string[] = [];

    guessesData.data.forEach((guess: any, index: number) => {
      if (guess.status === "correct" && gameCards[index]) {
        if (guess.guessedPersonId) {
          correctPlayerIds.push(guess.guessedPersonId);
        }
        // Alternative: if the guess data contains the person information directly
        else if (guess.correctPersonId) {
          correctPlayerIds.push(guess.correctPersonId);
        }
      }
    });

    return [...new Set(correctPlayerIds)]; // Remove duplicates
  };

  const correctlyGuessedPlayerIds = getCorrectlyGuessedPlayerIds();

  // Loading state
  if (isLoading) {
    return <Loader />;
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
  if (!isGameStarted) {
    return <Navigate to="/game/waiting" replace />;
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
      correctlyGuessedPlayerIds={correctlyGuessedPlayerIds} // Pass correctly guessed player IDs
    />
  );
};

export default GameArenaPage;
