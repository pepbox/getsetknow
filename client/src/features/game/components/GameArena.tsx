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
} from "@mui/material";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import GlobalButton from "../../../components/ui/button";

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
  const handleIKnowWhoThisIs = () => {
    setKnowsPerson(true);
    console.log("I know who this is clicked");
  };

  const handleCantFindThem = () => {
    console.log("Can't find him/her clicked");
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

        {knowsPerson && (
          <Grid
            container
            spacing={2}
            sx={{
              mb: "20vh",
              border: "2px solid black",
              padding: "24px 8px",
              m: "16px 8px",
              borderRadius: "8px",
            }}
          >
            {dummyData.players.map((player, index) => (
              <Grid
                size={4}
                key={index}
                sx={{
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
        )}
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
          <GlobalButton
            onClick={handleIKnowWhoThisIs}
            sx={{ maxWidth: "300px", mx: "auto" }}
          >
            I know who this is
          </GlobalButton>

          <GlobalButton
            onClick={handleCantFindThem}
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
        </Box>
      </Box>
    </Box>
  );
};

export default GameArena;
