import React, { useState } from "react";
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
import GlobalButton from "../../../components/ui/button";
import ConfirmationModal from "./ConfirmationModa";
import QuestionsNavigationModal from "./QuestionsNavigationModal";

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
  };
  progressValue: number;
  selectedPersonId: string | null;
  currentQuestionIndex: number; // Add this new prop
  onPersonSelect: (personId: string) => void;
  onSubmitGuess: () => void;
  onNextCard: () => void;
  onSkipCard: () => void;
  onClearSelection: () => void;
  onNavigateToQuestion: (questionIndex: number) => void; // Add this new prop
  guesses: Array<{
    guessId: string;
    status: "correct" | "wrong" | "no guess";
  }>;
}

const GameArena: React.FC<GameArenaProps> = ({
  data,
  progressValue,
  selectedPersonId,
  currentQuestionIndex, // New prop
  onPersonSelect,
  onSubmitGuess,
  onNextCard,
  onSkipCard,
  onClearSelection,
  onNavigateToQuestion, // New prop
  guesses,
}) => {
  const [knowsPerson, setKnowsPerson] = useState<boolean>(false);
  const [skipModal, setSkipModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [questionsModal, setQuestionsModal] = useState(false);

  // const { data: guessesData, isLoading: guessesLoading } =
  //   useGetUserGuessesQuery();

  const handleIKnowWhoThisIs = () => {
    setKnowsPerson(true);
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
  };

  const handlePersonClick = (personId: string) => {
    onPersonSelect(personId);
    // setKnowsPerson(false);
  };

  const handleBackClick = () => {
    onClearSelection();
    setKnowsPerson(false);
  };

  const handleNextClick = () => {
    onNextCard();
  };

  const handleQuestionsModalOpen = () => setQuestionsModal(true);
  const handleQuestionsModalClose = () => setQuestionsModal(false);

  const handleNavigateToQuestion = (questionIndex: number) => {
    onNavigateToQuestion(questionIndex);
  };
  const handleAssignmentIconClick = () => {
    handleQuestionsModalOpen();
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

  // Show result screen if there's a guess result
  if (data?.isLastGuessCorrect !== undefined) {
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
            height: "50px",
            zIndex: 1000,
            display: "flex",
            p: 2,
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
          <Box
            position={"absolute"}
            bottom={0}
            component="img"
            sx={{
              width: "300px",
              height: "300px",
              objectFit: "contain",
            }}
            src={
              data?.isLastGuessCorrect
                ? "/src/assets/guessedRight.png"
                : "/src/assets/guessedWrong.png"
            }
            alt=" "
          />
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
            variant="h6"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              mb: 2,
            }}
          >
            {data?.isLastGuessCorrect ? (
              <>
                Wohoo! You guessed it right.
                <br />
                Thanks for the participation.
              </>
            ) : (
              <>
                Oops! Better luck next time.
                <br />
                Keep trying!
              </>
            )}
          </Typography>

          {!data?.gameCompleted && (
            <GlobalButton
              onClick={handleNextClick}
              sx={{ maxWidth: "300px", mx: "auto" }}
            >
              Next Player
            </GlobalButton>
          )}
        </Box>
      </Box>
    );
  }

  // Game completed screen
  if (data?.gameCompleted) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          p: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
          Game Completed!
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Final Score: {data?.totalScore}
        </Typography>
        <Typography variant="body1">
          People you know: {data?.peopleIKnow}
        </Typography>
      </Box>
    );
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
            maxHeight:`${window.innerHeight - 250}px`,
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
          primaryButtonText="No"
          secondaryButtonText="Yes"
          onPrimaryClick={handleSkipModalClose}
          onSecondaryClick={handleSkipConfirm}
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
          onClose={() => setKnowsPerson(false)}
          slotProps={{
            paper: {
              sx: {
                m: "16px",
                position: "fixed",
                height: "auto",
                borderRadius: 2,
                p: 2,
              },
            },
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <IconButton
            onClick={() => setKnowsPerson(false)}
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

          <Box sx={{ mt: 4, mb: 2 }}>
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
            {data?.players.map((player) => {
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
            })}

            <GlobalButton
              onClick={handleSubmitModalOpen}
              disabled={!selectedPersonId}
              sx={{ maxWidth: "300px", mx: "auto", mt: 2 }}
            >
              Submit
            </GlobalButton>
          </Box>
        </Drawer>

        {/* Action Buttons */}
        {/* <Box height={"50px"} /> */}
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
          {!selectedPersonId && (
            <GlobalButton
              onClick={handleIKnowWhoThisIs}
              sx={{ minWidth: "200px", mx: "auto" }}
            >
              I know who this is
            </GlobalButton>
          )}

          {!selectedPersonId && (
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
          )}
          {selectedPersonId && (
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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GameArena;
