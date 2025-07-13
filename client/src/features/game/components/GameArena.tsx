import React, { useState } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  LinearProgress,
  Avatar,
  Grid,
  Drawer,
} from "@mui/material";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import GlobalButton from "../../../components/ui/button";
import ConfirmationModal from "./ConfirmationModa";

// Dummy data - will be replaced with backend data
const dummyData = {
  totalScore: 120,
  peopleIKnow: 5,
  peopleWhoKnowMe: 8,
  profile: {
    birthCity: "Udaipur",
    passion: "Playing guitar",
    everydayJoy: "listening to music on spotify",
    favFood: "Pav bhaji",
    favEmoji: "⭐",
    hiddenTalent: "Can convince someone",
  },
  players: [
    {
      name: "Udhay Pareek",
    },
    {
      name: "Manish Bulchandani",
    },
    {
      name: "Amit Sunda",
    },
    {
      name: "Parag Jain",
    },
    {
      name: "Sourabh Purbia",
    },
    {
      name: "Palak Jain",
    },
  ],
};

const GameArena: React.FC = () => {
  const [knowsPerson, setKnowsPerson] = useState<boolean>(false);
  const [person, setPerson] = useState<string>("");
  const [skipModal, setSkipModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [GuessedRight, setGuessedRight] = useState<boolean>(true);
  const handleIKnowWhoThisIs = () => {
    setKnowsPerson(true);
    console.log("I know who this is clicked");
  };

  const handleSkipModalOpen = () => setSkipModal(true);
  const handleSkipModalClose = () => setSkipModal(false);
  const handleSkipConfirm = () => {
    console.log("Skipping to next player");
    // Add your skip logic here
  };
  const handleSubmitModalOpen = () => setSubmitModal(true);
  const handleSubmitModalClose = () => setSubmitModal(false);
  const handleSubmitConfirm = () => {
    console.log("Submitting form");
    // Add your submit logic here
  };
  const progressValue = 75;

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
            onClick={() => {
              setGuessedRight(!GuessedRight);
            }}
          >
            <AssignmentTurnedInOutlinedIcon sx={{ color: "text.primary" }} />
          </IconButton>
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

      {/* Main Content */}
      {GuessedRight ? (
        <>
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
              src="/src/assets/guessedRight.png"
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
              Wohoo! You guessed it right.
              <br />
              Thanks for the participation.
            </Typography>
          </Box>{" "}
        </>
      ) : (
        <>
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
                marginBottom: "24px",
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
                  {dummyData.totalScore}
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
                  {dummyData.peopleIKnow}
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
                  {dummyData.peopleWhoKnowMe}
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
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {/* Profile Fields - Dynamically Generated */}
              {Object.entries(dummyData.profile).map(([key, value], index) => (
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
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
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

            {/* Drawer-like Player Selection */}
            <Drawer
              anchor="bottom"
              open={knowsPerson}
              onClose={() => setKnowsPerson(false)}
              slotProps={{
                paper: {
                  sx: {
                    bottom: "150px", // lifts the drawer up from bottom
                    position: "fixed", // override default absolute positioning
                    height: "auto", // optional
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
              <Grid
                container
                spacing={2}
                sx={{
                  mb: 2,
                  mt: 2,
                }}
              >
                {dummyData.players.map((player, index) => (
                  <Grid
                    size={4}
                    key={index}
                    onClick={() => setPerson(player.name)}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      alt={player.name}
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "primary.main",
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        color: "black",
                        fontWeight: 500,
                      }}
                    >
                      {player.name.split(" ").map((word, i, arr) => (
                        <React.Fragment key={i}>
                          {word}
                          {i < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Drawer>
            {/* Action Buttons */}
            <Box height={"150px"} />
            <Box
              sx={{
                display: "flex",
                position: "fixed",
                bottom: 0,
                bgcolor: "white",
                flexDirection: "column",
                gap: "12px",
                padding: "20px",
                width: "100%",
              }}
            >
              {!person && (
                <GlobalButton
                  onClick={handleIKnowWhoThisIs}
                  sx={{ maxWidth: "300px", mx: "auto" }}
                >
                  I know who this is
                </GlobalButton>
              )}
              {person && (
                <GlobalButton
                  onClick={handleSubmitModalOpen}
                  sx={{ maxWidth: "300px", mx: "auto" }}
                >
                  Submit
                </GlobalButton>
              )}

              {!person && (
                <GlobalButton
                  onClick={handleSkipModalOpen}
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
                  Can't find him/her
                </GlobalButton>
              )}
              {person && (
                <GlobalButton
                  onClick={handleSkipModalOpen}
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
        </>
      )}
    </Box>
  );
};

export default GameArena;
