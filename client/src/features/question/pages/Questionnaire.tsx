import React from "react";
import { useFetchAllQuestionsQuery } from "../services/questions.api";
import Loader from "../../../components/ui/Loader";
import ErrorLayout from "../../../components/ui/Error";
import QuestionnaireScreen from "../components/QuestionnaireScreen";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCurrentStep, setTotalSteps } from "../../game/services/gameSlice";
import { Navigate } from "react-router-dom";
import { RootState } from "../../../app/store";

const Questionnaire: React.FC = () => {
  const { data: questions, isError, isLoading } = useFetchAllQuestionsQuery({});
  const dispatch = useAppDispatch();
  const isGameStarted = useAppSelector(
    (state: RootState) => state.game.isGameStarted
  );

  if (isLoading) {
    return <Loader />;
  }
  if (isError || !questions || questions.length === 0) {
    return <ErrorLayout />;
  }
  dispatch(setCurrentStep(0));
  dispatch(setTotalSteps(questions.length - 1));
  if (isGameStarted) {
    return <Navigate to="/game/arena" replace />;
  }

  return <QuestionnaireScreen questions={questions} />;
};

export default Questionnaire;
