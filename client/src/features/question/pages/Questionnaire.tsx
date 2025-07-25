import React from "react";
import { useFetchAllQuestionsQuery } from "../services/questions.api";
import Loader from "../../../components/ui/Loader";
import ErrorLayout from "../../../components/ui/Error";
import QuestionnaireScreen from "../components/QuestionnaireScreen";
import { useAppDispatch } from "../../../app/hooks";
import { setTotalSteps } from "../../game/services/gameSlice";

const Questionnaire: React.FC = () => {
  const { data: questions, isError, isLoading } = useFetchAllQuestionsQuery({});
  const dispatch = useAppDispatch();

  if (isLoading) {
    return <Loader />;
  }
  if (isError || !questions || questions.length === 0) {
    return <ErrorLayout />;
  }
  dispatch(setTotalSteps(questions.length));

  return <QuestionnaireScreen questions={questions} />;
};

export default Questionnaire;
