import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addAnswer, nextQuestion } from "../services/gameSlice";
import GlobalButton from "../../../components/ui/button";
import GameHeader from "../../../components/layout/GameHeader";

const QuestionnaireScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { questions, currentQuestionIndex } = useAppSelector(
    (state) => state.game
  );
  const [answer, setAnswer] = useState("");

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    if (answer.trim()) {
      dispatch(
        addAnswer({
          questionId: currentQuestion.id,
          playerId: "current-player",
          answer: answer.trim(),
        })
      );

      if (currentQuestionIndex < questions.length - 1) {
        dispatch(nextQuestion());
        setAnswer("");
      } else {
        navigate("/game/waiting");
      }
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <GameHeader />

      <Box
        position={"relative"}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "primary.main",
          height: "300px",
        }}
      >
        <Box
          position={"absolute"}
          top={0}
          component="img"
          sx={{
            width: "185px",
            height: "185px",
            objectFit: "contain",
          }}
          src={currentQuestion.questionImage}
          alt="Character 1"
        />

        <Box
          position={"absolute"}
          top={"62%"}
          sx={{
            width: "100%",
            maxWidth: 300,
            bgcolor: "white",
            border: "1px solid black",
            borderRadius: 2,
            p: 3,
            display: "flex",
            flexDirection: "column",
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
            {currentQuestion.questionText}
          </Typography>

          <TextField
            fullWidth
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <GlobalButton
            onClick={handleSubmit}
            disabled={!answer.trim()}
            sx={{
              bgcolor: "#10B981",
              "&:hover": { bgcolor: "#059669" },
              mt: 2,
            }}
          >
            Submit
          </GlobalButton>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionnaireScreen;
