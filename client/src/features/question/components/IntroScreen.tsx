import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import GlobalButton from "../../../components/ui/button";
import GameHeader from "../../../components/layout/GameHeader";
// import ProgressComponent from "../../../components/layout/ProgressComponent";
import { useAppDispatch } from "../../../app/hooks";
import { setCurrentStep } from "../../game/services/gameSlice";

const IntroScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sessionId = useParams<{ sessionId: string }>().sessionId;

  const handleJumpIn = () => {
    dispatch(setCurrentStep(4));
    navigate(`/game/${sessionId}/questionnaire`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <GameHeader />
      {/* <ProgressComponent /> */}

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
          src="/src/assets/introScreen.png"
          alt="Character 1"
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
          Ready to be the mystery?
          <br />
          Spill some fun facts about yourself...
        </Typography>

        <GlobalButton
          onClick={handleJumpIn}
          sx={{
            maxWidth: "300px",
          }}
        >
          Jump in
        </GlobalButton>
      </Box>
    </Box>
  );
};

export default IntroScreen;
