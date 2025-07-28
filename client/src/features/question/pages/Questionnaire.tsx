import React, { useEffect } from "react";
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
  const { sessionId } = useAppSelector((state: RootState) => state.game);

  useEffect(() => {
    if (questions && questions.length > 0) {
      dispatch(setCurrentStep(0));
      dispatch(setTotalSteps(questions.length - 1));
    }
  }, [questions, dispatch]);

  if (isLoading) {
    return <Loader />;
  }
  if (isError || !questions || questions.length === 0) {
    return <ErrorLayout />;
  }

  if (isGameStarted) {
    return <Navigate to={`/game/${sessionId}/arena`} replace />;
  }

  return (
    <QuestionnaireScreen questions={questions} sessionId={sessionId || ""} />
  );
};

export default Questionnaire;
