import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField } from "@mui/material";
import { useAppDispatch } from "../../../app/hooks";
import { setCurrentStep } from "../../game/services/gameSlice";
import GlobalButton from "../../../components/ui/button";
import GameHeader from "../../../components/layout/GameHeader";
import ProgressComponent from "../../../components/layout/ProgressComponent";
import { IQuestion } from "../services/questions.slice";
import { useStoreQuestionResponseMutation } from "../services/questions.api";

interface QuestionnaireScreenProps {
  questions: IQuestion[];
}
const QuestionnaireScreen: React.FC<QuestionnaireScreenProps> = ({
  questions = [],
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [StoreQuestionResponse] = useStoreQuestionResponseMutation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(1);
  const [answers, setAnswers] = useState<string[]>([]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    if ((answers[currentQuestionIndex] || "").trim()) {
      StoreQuestionResponse({
        question: currentQuestion._id,
        response: answers[currentQuestionIndex] || "",
      })
        .unwrap()
        .then(() => {
          console.log("Response stored successfully");
          if (currentQuestionIndex < questions.length - 1) {
            dispatch(setCurrentStep(currentQuestionIndex));
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            // dispatch(nextQuestion());
            // setAnswer("");
          } else {
            navigate("/game/waiting");
          }
        })
        .catch((error) => {
          console.error("Error storing response:", error);
        });
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
      <ProgressComponent />

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
            value={answers[currentQuestionIndex] || ""}
            onChange={(e) =>
              setAnswers((prev) => {
                const updated = [...prev];
                updated[currentQuestionIndex] = e.target.value;
                return updated;
              })
            }
            placeholder="Your answer..."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <GlobalButton
            onClick={handleSubmit}
            disabled={!(answers[currentQuestionIndex] || "").trim()}
            sx={{
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
