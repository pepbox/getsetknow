// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   AppBar,
//   Toolbar,
//   IconButton,
//   LinearProgress,
//   Avatar,
//   Grid,
//   Drawer,
// } from "@mui/material";
// import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
// import GlobalButton from "../../../components/ui/button";
// import ConfirmationModal from "./ConfirmationModa";

// // Dummy data - will be replaced with backend data
// const dummyData = {
//   totalScore: 120,
//   peopleIKnow: 5,
//   peopleWhoKnowMe: 8,
//   profile: {
//     birthCity: "Udaipur",
//     passion: "Playing guitar",
//     everydayJoy: "listening to music on spotify",
//     favFood: "Pav bhaji",
//     favEmoji: "⭐",
//     hiddenTalent: "Can convince someone",
//   },
//   players: [
//     {
//       name: "Udhay Pareek",
//     },
//     {
//       name: "Manish Bulchandani",
//     },
//     {
//       name: "Amit Sunda",
//     },
//     {
//       name: "Parag Jain",
//     },
//     {
//       name: "Sourabh Purbia",
//     },
//     {
//       name: "Palak Jain",
//     },
//   ],
// };

// const GameArena: React.FC = () => {
//   const [knowsPerson, setKnowsPerson] = useState<boolean>(false);
//   const [person, setPerson] = useState<string>("");
//   const [skipModal, setSkipModal] = useState(false);
//   const [submitModal, setSubmitModal] = useState(false);
//   const [GuessedRight, setGuessedRight] = useState<boolean>(true);
//   const handleIKnowWhoThisIs = () => {
//     setKnowsPerson(true);
//     console.log("I know who this is clicked");
//   };

//   const handleSkipModalOpen = () => setSkipModal(true);
//   const handleSkipModalClose = () => setSkipModal(false);
//   const handleSkipConfirm = () => {
//     console.log("Skipping to next player");
//     // Add your skip logic here
//   };
//   const handleSubmitModalOpen = () => setSubmitModal(true);
//   const handleSubmitModalClose = () => setSubmitModal(false);
//   const handleSubmitConfirm = () => {
//     console.log("Submitting form");
//     // Add your submit logic here
//   };
//   const progressValue = 75;

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* Header */}
//       <AppBar
//         position="static"
//         elevation={0}
//         sx={{
//           borderRadius: 0,
//         }}
//       >
//         <Toolbar sx={{ justifyContent: "space-between" }}>
//           <Typography
//             variant="h3"
//             sx={{
//               mx: "auto",
//               textAlign: "center",
//             }}
//           >
//             GetSetKnow!
//           </Typography>
//           <IconButton
//             edge="end"
//             color="inherit"
//             onClick={() => {
//               setGuessedRight(!GuessedRight);
//             }}
//           >
//             <AssignmentTurnedInOutlinedIcon sx={{ color: "text.primary" }} />
//           </IconButton>
//         </Toolbar>
//       </AppBar>

//       <Box
//         sx={{
//           width: "100%",
//           height: "50px",
//           zIndex: 1000,
//           display: "flex",
//           p: 2,
//           alignItems: "center",
//         }}
//       >
//         <LinearProgress
//           variant="determinate"
//           value={progressValue}
//           sx={{
//             width: "100%",
//             height: 6,
//             borderRadius: 0,
//             backgroundColor: "#78788029",
//             "& .MuiLinearProgress-bar": {
//               borderRadius: 0,
//               backgroundColor: "secondary.main",
//             },
//           }}
//         />
//       </Box>

//       {/* Main Content */}
//       {GuessedRight ? (
//         <>
//           <Box
//             sx={{
//               display: "flex",
//               position: "relative",
//               flexDirection: "column",
//               height: "50vh",
//               bgcolor: "primary.main",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Box
//               position={"absolute"}
//               bottom={0}
//               component="img"
//               sx={{
//                 width: "300px",
//                 height: "300px",
//                 objectFit: "contain",
//               }}
//               src="/src/assets/guessedRight.png"
//               alt=" "
//             />
//           </Box>
//           <Box
//             sx={{
//               width: "100%",
//               mt: 2,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               gap: 2,
//             }}
//           >
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: "bold",
//                 textAlign: "center",
//                 mb: 2,
//               }}
//             >
//               Wohoo! You guessed it right.
//               <br />
//               Thanks for the participation.
//             </Typography>
//           </Box>{" "}
//         </>
//       ) : (
//         <>
//           <Box
//             sx={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             {/* Stats Cards */}
//             <Box
//               sx={{
//                 display: "flex",
//                 bgcolor: "primary.main",
//                 flexDirection: "row",
//                 gap: "12px",
//                 marginBottom: "24px",
//                 padding: "16px",
//               }}
//             >
//               <Box
//                 display={"flex"}
//                 flex={1}
//                 flexDirection={"column"}
//                 alignItems={"center"}
//                 textAlign={"center"}
//                 justifyContent={"center"}
//               >
//                 <Typography
//                   variant="h4"
//                   sx={{
//                     fontSize: "14px",
//                     color: "white",
//                     mb: 1,
//                   }}
//                 >
//                   Total <br /> Score
//                 </Typography>
//                 <Typography
//                   variant="h3"
//                   sx={{
//                     color: "#FFFFFF",
//                   }}
//                 >
//                   {dummydata?.totalScore}
//                 </Typography>
//               </Box>
//               <Box bgcolor={"white"} width={"2px"} py={2} />

//               <Box
//                 display={"flex"}
//                 flex={1}
//                 flexDirection={"column"}
//                 alignItems={"center"}
//                 textAlign={"center"}
//                 justifyContent={"center"}
//               >
//                 <Typography
//                   variant="h4"
//                   sx={{
//                     fontSize: "14px",
//                     mb: 1,
//                     color: "white",
//                   }}
//                 >
//                   People I <br /> know
//                 </Typography>
//                 <Typography
//                   variant="h3"
//                   sx={{
//                     color: "#FFFFFF",
//                   }}
//                 >
//                   {dummydata?.peopleIKnow}
//                 </Typography>
//               </Box>

//               <Box bgcolor={"white"} width={"2px"} py={2} />

//               <Box
//                 display={"flex"}
//                 flex={1}
//                 flexDirection={"column"}
//                 alignItems={"center"}
//                 justifyContent={"center"}
//                 textAlign={"center"}
//               >
//                 <Typography
//                   variant="h4"
//                   sx={{
//                     mb: 1,
//                     fontSize: "14px",
//                     color: "white",
//                   }}
//                 >
//                   People who <br /> know me
//                 </Typography>
//                 <Typography
//                   variant="h3"
//                   sx={{
//                     color: "#FFFFFF",
//                   }}
//                 >
//                   {dummydata?.peopleWhoKnowMe}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Profile Information */}
//             <Box
//               sx={{
//                 flex: 1,
//                 bgcolor: "primary.main",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "16px",
//                 p: "24px",
//                 maxHeight: "300px",
//                 overflowY: "auto",
//               }}
//             >
//               {/* Profile Fields - Dynamically Generated */}
//               {Object.entries(dummydata?.profile).map(([key, value], index) => (
//                 <Box
//                   key={index}
//                   sx={{ display: "flex", alignItems: "center", gap: "12px" }}
//                 >
//                   <Typography
//                     variant="body1"
//                     sx={{
//                       color: "#FFFFFF",
//                       minWidth: "100px",
//                       fontWeight: 500,
//                     }}
//                   >
//                     {key.charAt(0).toUpperCase() +
//                       key.slice(1).replace(/([A-Z])/g, " $1")}
//                   </Typography>

//                   <Box
//                     sx={{
//                       border: "2px solid white",
//                       color: "white",
//                       padding: "1px 8px",
//                       width: "100%",
//                       textAlign: "left",
//                       borderRadius: "8px",
//                     }}
//                   >
//                     <Typography variant="h6" sx={{ textWrap: "wrap" }}>
//                       {value}
//                     </Typography>
//                   </Box>
//                 </Box>
//               ))}
//             </Box>

//             <ConfirmationModal
//               open={skipModal}
//               onClose={handleSkipModalClose}
//               mainText="Are you sure you want to skip and jump to next player?"
//               primaryButtonText="No"
//               secondaryButtonText="Yes"
//               onPrimaryClick={handleSkipModalClose}
//               onSecondaryClick={handleSkipConfirm}
//             />
//             <ConfirmationModal
//               open={submitModal}
//               onClose={handleSubmitModalClose}
//               mainText="Are you sure you want to submit?"
//               primaryButtonText="Submit"
//               secondaryButtonText="Back"
//               onPrimaryClick={handleSubmitConfirm}
//               onSecondaryClick={handleSubmitModalClose}
//             />

//             {/* Drawer-like Player Selection */}
//             <Drawer
//               anchor="bottom"
//               open={knowsPerson}
//               onClose={() => setKnowsPerson(false)}
//               slotProps={{
//                 paper: {
//                   sx: {
//                     bottom: "150px", // lifts the drawer up from bottom
//                     position: "fixed", // override default absolute positioning
//                     height: "auto", // optional
//                   },
//                 },
//               }}
//               ModalProps={{
//                 keepMounted: true,
//               }}
//             >
//               <IconButton
//                 onClick={() => setKnowsPerson(false)}
//                 sx={{
//                   position: "absolute",
//                   top: 8,
//                   right: 8,
//                   zIndex: 2,
//                 }}
//                 aria-label="Close"
//               >
//                 <span style={{ fontSize: 24, fontWeight: "bold" }}>×</span>
//               </IconButton>
//               <Grid
//                 container
//                 spacing={2}
//                 sx={{
//                   mb: 2,
//                   mt: 2,
//                 }}
//               >
//                 {dummydata?.players.map((player, index) => (
//                   <Grid
//                     size={4}
//                     key={index}
//                     onClick={() => setPerson(player.name)}
//                     sx={{
//                       cursor: "pointer",
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Avatar
//                       alt={player.name}
//                       sx={{
//                         width: 56,
//                         height: 56,
//                         bgcolor: "primary.main",
//                       }}
//                     />
//                     <Typography
//                       variant="h6"
//                       sx={{
//                         textAlign: "center",
//                         color: "black",
//                         fontWeight: 500,
//                       }}
//                     >
//                       {player.name.split(" ").map((word, i, arr) => (
//                         <React.Fragment key={i}>
//                           {word}
//                           {i < arr.length - 1 && <br />}
//                         </React.Fragment>
//                       ))}
//                     </Typography>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Drawer>
//             {/* Action Buttons */}
//             <Box height={"150px"} />
//             <Box
//               sx={{
//                 display: "flex",
//                 position: "fixed",
//                 bottom: 0,
//                 bgcolor: "white",
//                 flexDirection: "column",
//                 gap: "12px",
//                 padding: "20px",
//                 width: "100%",
//               }}
//             >
//               {!person && (
//                 <GlobalButton
//                   onClick={handleIKnowWhoThisIs}
//                   sx={{ maxWidth: "300px", mx: "auto" }}
//                 >
//                   I know who this is
//                 </GlobalButton>
//               )}
//               {person && (
//                 <GlobalButton
//                   onClick={handleSubmitModalOpen}
//                   sx={{ maxWidth: "300px", mx: "auto" }}
//                 >
//                   Submit
//                 </GlobalButton>
//               )}

//               {!person && (
//                 <GlobalButton
//                   onClick={handleSkipModalOpen}
//                   sx={{
//                     maxWidth: "300px",
//                     mx: "auto",
//                     backgroundColor: "#FFFFFF",
//                     color: "#1C1C1E !important",
//                     border: "2px solid #E5E7EB",
//                     "&:hover": {
//                       backgroundColor: "#F3F4F6",
//                       color: "#1C1C1E !important",
//                     },
//                   }}
//                 >
//                   Can't find him/her
//                 </GlobalButton>
//               )}
//               {person && (
//                 <GlobalButton
//                   onClick={handleSkipModalOpen}
//                   sx={{
//                     maxWidth: "300px",
//                     mx: "auto",
//                     backgroundColor: "#FFFFFF",
//                     color: "#1C1C1E !important",
//                     border: "2px solid #E5E7EB",
//                     "&:hover": {
//                       backgroundColor: "#F3F4F6",
//                       color: "#1C1C1E !important",
//                     },
//                   }}
//                 >
//                   Back
//                 </GlobalButton>
//               )}
//             </Box>
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// };

// export default GameArena;

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
  onPersonSelect: (personId: string) => void;
  onSubmitGuess: () => void;
  onNextCard: () => void;
  onSkipCard: () => void;
  onClearSelection: () => void;
}

const GameArena: React.FC<GameArenaProps> = ({
  data,
  progressValue,
  selectedPersonId,
  onPersonSelect,
  onSubmitGuess,
  onNextCard,
  onSkipCard,
  onClearSelection,
}) => {
  const [knowsPerson, setKnowsPerson] = useState<boolean>(false);
  const [skipModal, setSkipModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);

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
    setKnowsPerson(false);
  };

  const handleBackClick = () => {
    onClearSelection();
    setKnowsPerson(false);
  };

  const handleNextClick = () => {
    onNextCard();
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
          <IconButton edge="end" color="inherit">
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
            maxHeight: "300px",
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

        {/* Drawer-like Player Selection */}
        <Drawer
          anchor="bottom"
          open={knowsPerson}
          onClose={() => setKnowsPerson(false)}
          slotProps={{
            paper: {
              sx: {
                bottom: "150px",
                position: "fixed",
                height: "auto",
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
            {data?.players.map((player, index) => (
              <Grid
                size={4}
                key={index}
                onClick={() => handlePersonClick(player._id)}
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
                  src={player.profilePhoto}
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
          {!selectedPersonId && (
            <GlobalButton
              onClick={handleIKnowWhoThisIs}
              sx={{ maxWidth: "300px", mx: "auto" }}
            >
              I know who this is
            </GlobalButton>
          )}
          {selectedPersonId && (
            <GlobalButton
              onClick={handleSubmitModalOpen}
              sx={{ maxWidth: "300px", mx: "auto" }}
            >
              Submit
            </GlobalButton>
          )}

          {!selectedPersonId && (
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
