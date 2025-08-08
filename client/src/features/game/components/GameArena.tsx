import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  LinearProgress,
  Avatar,
  Drawer,
} from "@mui/material";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import { Navigate } from "react-router-dom";
import GlobalButton from "../../../components/ui/button";
import ConfirmationModal from "./ConfirmationModa";
import QuestionsNavigationModal from "./QuestionsNavigationModal";
import SelfieUploadScreen from "./SelfieUploadScreen";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  replayLastCard,
  setSelfieUploaded,
  showSelfieUploadScreen,
} from "../services/gameArenaSlice";
import { RootState } from "../../../app/store";
import guessedWrong from "../../../assets/guessedWrong.webp";

interface GameArenaProps {
  data: {
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
  };
  progressValue: number;
  selectedPersonId: string | null;
  currentQuestionIndex: number; // Add this new prop
  showResult: boolean; // Add this new prop
  setShowResult: (value: boolean) => void; // Add this new prop
  onPersonSelect: (personId: string) => void;
  onSubmitGuess: () => void;
  onNextCard: () => void;
  onSkipCard: () => void;
  onClearSelection: () => void;
  onNavigateToQuestion: (questionIndex: number) => void; // Add this new prop
  guesses: Array<{
    guessId: string;
    status: "correct" | "wrong" | "no guess";
    hasSelfie?: boolean;
    requiresSelfie?: boolean;
  }>;
  correctlyGuessedPlayerIds?: string[]; // Add this new prop to track correctly guessed players
}

const GameArena: React.FC<GameArenaProps> = ({
  data,
  progressValue,
  selectedPersonId,
  currentQuestionIndex,
  showResult,
  setShowResult, // New prop
  onPersonSelect,
  onSubmitGuess,
  onNextCard,
  onSkipCard,
  onClearSelection,
  onNavigateToQuestion, // New prop
  guesses,
  correctlyGuessedPlayerIds = [], // New prop with default value
}) => {
  const dispatch = useAppDispatch();
  const { sessionId } = useAppSelector((state: RootState) => state.game);
  const { showSelfieUpload, currentSelfieGuessId } = useAppSelector(
    (state: RootState) => state.gameArena
  );
  const [knowsPerson, setKnowsPerson] = useState<boolean>(false);
  const [skipModal, setSkipModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [questionsModal, setQuestionsModal] = useState(false);

  const handleIKnowWhoThisIs = () => {
    setKnowsPerson(true);
    setSearchText(""); // Clear search when opening drawer
  };

  const handleSkipModalOpen = () => setSkipModal(true);
  const handleSkipModalClose = () => setSkipModal(false);
  const handleSkipConfirm = () => {
    setSkipModal(false);
    onSkipCard();
  };

  const handleSubmitModalOpen = () => setSubmitModal(true);
  const handleSubmitModalClose = () => setSubmitModal(false);
  const handleSubmitConfirm = () => {
    setSubmitModal(false);
    onSubmitGuess();
    setShowResult(true);
  };

  const handlePersonClick = (personId: string) => {
    onPersonSelect(personId);
    // setKnowsPerson(false);
  };

  const handleNextClick = () => {
    onNextCard();
    setShowResult(false);
  };
  const handleReplayClick = () => {
    dispatch(replayLastCard());
    setShowResult(false);
  };

  const handleQuestionsModalOpen = () => setQuestionsModal(true);
  const handleQuestionsModalClose = () => setQuestionsModal(false);

  const handleNavigateToQuestion = (questionIndex: number) => {
    onNavigateToQuestion(questionIndex);
  };
  const handleAssignmentIconClick = () => {
    handleQuestionsModalOpen();
  };

  // Selfie upload handlers
  const handleSelfieUploaded = () => {
    if (currentSelfieGuessId) {
      dispatch(setSelfieUploaded({ guessId: currentSelfieGuessId }));
    }
    handleNextClick();
  };

  // Format profile key for display
  const formatProfileKey = (key: string): string => {
    const keyMapping: Record<string, string> = {
      birthPlace: "Birth Place",
      favoriteFood: "Favorite Food",
      mostUsedEmoji: "Most Used Emoji",
      passion: "Passion",
      everydayJoy: "Everyday Joy",
      hiddenTalent: "Hidden Talent",
    };

    return (
      keyMapping[key] ||
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

  // Filter players: Remove correctly guessed players and apply search
  const getFilteredPlayers = () => {
    if (!data?.players) return [];

    // First, filter out correctly guessed players
    let availablePlayers = data.players.filter(
      (player) =>
        player._id &&
        Array.isArray(correctlyGuessedPlayerIds) &&
        !correctlyGuessedPlayerIds.includes(player?._id)
    );

    // Apply search filter
    if (searchText.trim()) {
      availablePlayers = availablePlayers.filter((player) =>
        player.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return availablePlayers;
  };

  const filteredPlayers = getFilteredPlayers();

  // Clear selection if selected player is no longer available (was correctly guessed)
  useEffect(() => {
    if (
      selectedPersonId &&
      !filteredPlayers.some((player) => player._id === selectedPersonId)
    ) {
      // The selected player is no longer available, clear the selection
      onClearSelection(); // Use the proper clear function
    }
  }, [selectedPersonId, filteredPlayers, onClearSelection]);

  // Check if current guess requires selfie upload
  const currentGuessRequiresSelfie = () => {
    if (!data?.currentGuessId) return false;

    const currentGuess = guesses.find(
      (guess) => guess.guessId === data.currentGuessId
    );
    return currentGuess?.requiresSelfie === true;
  };

  // Show selfie upload screen if required
  if (showSelfieUpload && currentSelfieGuessId) {
    return (
      <SelfieUploadScreen
        data={{
          currentGuessId: currentSelfieGuessId,
          lastGuessPlayerPhoto: data.lastGuessPlayerPhoto,
          lastGuessPlayerName: data.lastGuessPlayerName,
        }}
        progressValue={progressValue}
        onSelfieUploaded={handleSelfieUploaded}
      />
    );
  }

  // Show result screen if there's a guess result
  if (showResult) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            borderRadius: 0,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h3"
              sx={{
                mx: "auto",
                textAlign: "center",
              }}
            >
              GetSetKnow!
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            width: "100%",
            height: "6px",
            zIndex: 1000,
            display: "flex",
            p: 0,
            alignItems: "center",
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              width: "100%",
              height: 6,
              borderRadius: 0,
              backgroundColor: "#78788029",
              "& .MuiLinearProgress-bar": {
                borderRadius: 0,
                backgroundColor: "secondary.main",
              },
            }}
          />
        </Box>

        {/* Result Screen */}
        <Box
          sx={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            height: "50vh",
            bgcolor: "primary.main",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data?.isLastGuessCorrect ? (
            // Show player's actual photo when guess is correct
            data?.lastGuessPlayerPhoto ? (
              <>
                <Avatar
                  src={data.lastGuessPlayerPhoto}
                  sx={{
                    width: 200,
                    height: 200,
                    border: "4px solid white",
                  }}
                />
                {data?.lastGuessPlayerName && (
                  <Typography variant="h4" sx={{ mt: 2 }}>
                    {data.lastGuessPlayerName}
                  </Typography>
                )}
              </>
            ) : (
              <>
                <Avatar
                  sx={{
                    width: 200,
                    height: 200,
                    border: "4px solid white",
                    fontSize: "3rem",
                    backgroundColor: "secondary.main",
                  }}
                >
                  {data?.lastGuessPlayerName?.charAt(0) || "?"}
                </Avatar>
                {data?.lastGuessPlayerName && (
                  <Typography variant="h4" sx={{ mt: 2 }}>
                    {data.lastGuessPlayerName}
                  </Typography>
                )}
              </>
            )
          ) : (
            // Show wrong guess image
            <Box
              position={"absolute"}
              bottom={0}
              component="img"
              sx={{
                width: "300px",
                height: "300px",
                objectFit: "contain",
              }}
              src={guessedWrong}
              alt=" "
            />
          )}
        </Box>

        <Box
          sx={{
            width: "100%",
            mt: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              // fontWeight: "bold",
              textAlign: "center",
              mb: 2,
            }}
          >
            {data?.isLastGuessCorrect ? (
              <>
                Wohoo! You guessed it right.
                <br />
                Score: {data.lastGuessScore}
                {currentGuessRequiresSelfie() && (
                  <>
                    <br />
                    <br />
                    📸 Take a selfie with {data.lastGuessPlayerName} to
                    continue!
                  </>
                )}
              </>
            ) : (
              <>
                Oops! Better luck next time.
                <br />
                Keep trying!
                <br />
                Attempts: {data.lastGuessAttempts ?? 1}
              </>
            )}
          </Typography>

          {data?.isLastGuessCorrect && currentGuessRequiresSelfie() ? (
            <GlobalButton
              onClick={() =>
                dispatch(
                  showSelfieUploadScreen({ guessId: data.currentGuessId })
                )
              }
              sx={{ maxWidth: "300px", mx: "auto" }}
            >
              Take Selfie
            </GlobalButton>
          ) : (
            <GlobalButton
              onClick={handleNextClick}
              sx={{ maxWidth: "300px", mx: "auto" }}
            >
              Next Player
            </GlobalButton>
          )}

          {!data?.isLastGuessCorrect && (
            <GlobalButton
              onClick={handleReplayClick}
              sx={{
                maxWidth: "300px",
                mx: "auto",
                bgcolor: "primary.main",
                color: "#fff",
                "&:hover": {
                  bgcolor: "primary.main",
                },
              }}
            >
              Retry
            </GlobalButton>
          )}
        </Box>
      </Box>
    );
  }

  // Game completed screen
  if (data?.gameCompleted) {
    return <Navigate to={`/game/${sessionId}/completion`} replace />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          borderRadius: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h3"
            sx={{
              mx: "auto",
              textAlign: "center",
            }}
          >
            GetSetKnow!
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleAssignmentIconClick}
          >
            <AssignmentTurnedInOutlinedIcon sx={{ color: "text.primary" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: "100%",
          height: "6px",
          zIndex: 1000,
          display: "flex",
          p: 0,
          alignItems: "center",
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            width: "100%",
            height: 6,
            borderRadius: 0,
            backgroundColor: "#78788029",
            "& .MuiLinearProgress-bar": {
              borderRadius: 0,
              backgroundColor: "secondary.main",
            },
          }}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Stats Cards */}
        <Box
          sx={{
            display: "flex",
            bgcolor: "primary.main",
            flexDirection: "row",
            gap: "12px",
            marginBottom: "4px",
            padding: "16px",
          }}
        >
          <Box
            display={"flex"}
            flex={1}
            flexDirection={"column"}
            alignItems={"center"}
            textAlign={"center"}
            justifyContent={"center"}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: "14px",
                color: "white",
                mb: 1,
              }}
            >
              Total <br /> Score
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: "#FFFFFF",
              }}
            >
              {data?.totalScore}
            </Typography>
          </Box>
          <Box bgcolor={"white"} width={"2px"} py={2} />

          <Box
            display={"flex"}
            flex={1}
            flexDirection={"column"}
            alignItems={"center"}
            textAlign={"center"}
            justifyContent={"center"}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: "14px",
                mb: 1,
                color: "white",
              }}
            >
              People I <br /> know
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: "#FFFFFF",
              }}
            >
              {data?.peopleIKnow}
            </Typography>
          </Box>

          <Box bgcolor={"white"} width={"2px"} py={2} />

          <Box
            display={"flex"}
            flex={1}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            textAlign={"center"}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontSize: "14px",
                color: "white",
              }}
            >
              People who <br /> know me
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: "#FFFFFF",
              }}
            >
              {data?.peopleWhoKnowMe}
            </Typography>
          </Box>
        </Box>

        {/* Profile Information */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "primary.main",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            p: "24px",
            maxHeight: `${window.innerHeight - 250}px`,
            overflowY: "auto",
          }}
        >
          {/* Profile Fields - Dynamically Generated from Backend */}
          {data?.profile &&
            Object.entries(data.profile).map(([key, value], index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#FFFFFF",
                    minWidth: "100px",
                    fontWeight: 500,
                  }}
                >
                  {formatProfileKey(key)}
                </Typography>

                <Box
                  sx={{
                    border: "2px solid white",
                    color: "white",
                    padding: "1px 8px",
                    width: "100%",
                    textAlign: "left",
                    borderRadius: "8px",
                  }}
                >
                  <Typography variant="h6" sx={{ textWrap: "wrap" }}>
                    {value}
                  </Typography>
                </Box>
              </Box>
            ))}
        </Box>

        <ConfirmationModal
          open={skipModal}
          onClose={handleSkipModalClose}
          mainText="Are you sure you want to skip and jump to next player?"
          primaryButtonText="Yes"
          secondaryButtonText="No"
          onPrimaryClick={handleSkipConfirm}
          onSecondaryClick={handleSkipModalClose}
        />
        <ConfirmationModal
          open={submitModal}
          onClose={handleSubmitModalClose}
          mainText="Are you sure you want to submit?"
          primaryButtonText="Submit"
          secondaryButtonText="Back"
          onPrimaryClick={handleSubmitConfirm}
          onSecondaryClick={handleSubmitModalClose}
        />

        <QuestionsNavigationModal
          open={questionsModal}
          onClose={handleQuestionsModalClose}
          guesses={guesses || []}
          currentQuestionIndex={currentQuestionIndex}
          onNavigateToQuestion={handleNavigateToQuestion}
          // loading={guessesLoading}
        />

        {/* Drawer-like Player Selection */}
        <Drawer
          anchor="bottom"
          open={knowsPerson}
          onClose={() => {
            setKnowsPerson(false);
            setSearchText(""); // Clear search when closing drawer
          }}
          slotProps={{
            paper: {
              sx: {
                m: "16px",
                position: "fixed",
                height: "calc(100% - 64px)",
                borderRadius: 2,
                p: "8px 8px 0  8px",
                display: "flex",
                flexDirection: "column",
              },
            },
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <IconButton
            onClick={() => {
              setKnowsPerson(false);
              setSearchText(""); // Clear search when closing drawer
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
            }}
            aria-label="Close"
          >
            <span style={{ fontSize: 24, fontWeight: "bold" }}>×</span>
          </IconButton>

          <Box
            sx={{
              mt: 4,
              mb: 2,
              position: "relative",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ mb: 2 }}>
              <input
                type="text"
                placeholder="Search player"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  fontSize: "1rem",
                  outline: "none",
                  marginBottom: "8px",
                }}
              />
            </Box>

            {/* Show filtered players */}
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player) => {
                  const isSelected = selectedPersonId === player._id;
                  return (
                    <Box
                      key={player._id}
                      onClick={() => handlePersonClick(player._id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        py: 1,
                        mb: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        bgcolor: isSelected ? "primary.main" : "transparent",
                        transition: "background 0.2s",
                        "&:hover": {
                          bgcolor: isSelected ? "primary.main" : "grey.100",
                        },
                      }}
                    >
                      <Avatar
                        alt={player.name}
                        src={player.profilePhoto}
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "primary.main",
                          mr: 2,
                          border: isSelected ? "2px solid #fff" : undefined,
                        }}
                      >
                        {!player.profilePhoto &&
                          player.name
                            .split(" ")
                            .map((n) => n[0]?.toUpperCase())
                            .join("")
                            .slice(0, 2)}
                      </Avatar>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: isSelected ? "#fff" : "text.primary",
                          fontWeight: 500,
                          fontSize: "1rem",
                          textAlign: "left",
                          flex: 1,
                        }}
                      >
                        {player.name}
                      </Typography>
                    </Box>
                  );
                })
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                    px: 2,
                    minHeight: "120px",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    {searchText.trim()
                      ? `No players found matching "${searchText}"`
                      : "No available players to select"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                left: 0,
                bgcolor: "white",
                zIndex: 10,
                pt: 2,
                pb: 2,
              }}
            >
              <GlobalButton
                onClick={handleSubmitModalOpen}
                disabled={!selectedPersonId || filteredPlayers.length === 0}
                sx={{ width: "100%", mx: "auto", my: "10px" }}
              >
                Submit
              </GlobalButton>
            </Box>
          </Box>
        </Drawer>

        <Box
          sx={{
            display: "flex",
            position: "fixed",
            bottom: 0,
            bgcolor: "white",
            flexDirection: "row",
            gap: "12px",
            padding: "12px",
            height: "fit-content",
            width: "100%",
          }}
        >
          {/* {!selectedPersonId && ( */}
          <GlobalButton
            onClick={handleSkipModalOpen}
            sx={{
              // maxWidth: "300px",
              mx: "auto",
              backgroundColor: "#FFFFFF",
              color: "#1C1C1E !important",
              border: "2px solid #E5E7EB",
              "&:hover": {
                backgroundColor: "#F3F4F6",
                color: "#1C1C1E !important",
              },
            }}
          >
            Skip
          </GlobalButton>
          <GlobalButton
            onClick={handleIKnowWhoThisIs}
            sx={{ minWidth: "200px", mx: "auto" }}
          >
            I know who this is
          </GlobalButton>
          {/* // )} */}

          {/* {!selectedPersonId && ( */}

          {/* )} */}
          {/* {selectedPersonId && (
            <GlobalButton
              onClick={handleBackClick}
              sx={{
                maxWidth: "300px",
                mx: "auto",
                backgroundColor: "#FFFFFF",
                color: "#1C1C1E !important",
                border: "2px solid #E5E7EB",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                  color: "#1C1C1E !important",
                },
              }}
            >
              Back
            </GlobalButton>
          )} */}
        </Box>
      </Box>
    </Box>
  );
};

export default GameArena;
