import { Route, Routes, useParams } from "react-router-dom";
import WaitingAreaScreen from "../features/game/components/WaitingAreaScreen";
import CaptureScreen from "../features/player/components/CaptureScreen";
import HomeScreen from "../features/player/components/HomeScreen";
import IntroScreen from "../features/question/components/IntroScreen";
import Questionnaire from "../features/question/pages/Questionnaire";
import GameArenaPage from "../features/game/pages/GameArenaPage";
import GameCompletionPage from "../features/game/pages/GameCompletionPage";
import { useLazyFetchPlayerQuery } from "../features/player/services/player.api";
import { RootState } from "../app/store";
import { useEffect } from "react";
import Loader from "../components/ui/Loader";
import AuthWrapper from "../components/auth/AuthWrapper";
import { useAppDispatch, useAppSelector } from "../app/rootReducer";
import { setSessionId } from "../features/game/services/gameSlice";

const GameMain = () => {
  const [fetchUser] = useLazyFetchPlayerQuery();
  const { isLoading, isAuthenticated } = useAppSelector(
    (state: RootState) => state.player
  );
  const dispatch = useAppDispatch();
  const sessionId = useParams<{ sessionId: string }>().sessionId;

  useEffect(() => {
    dispatch(setSessionId(sessionId ?? ""));
  }, [dispatch, sessionId]);

  useEffect(() => {
    fetchUser({});
  }, [isAuthenticated]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        minHeight: window.innerHeight,
        background: "#FFFFFF",
      }}
    >
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/capture" element={<CaptureScreen />} />
        <Route
          path="/"
          element={
            <AuthWrapper
              userType={"player"}
              redirection={`/game/${sessionId}`}
            />
          }
        >
          <Route path="/intro" element={<IntroScreen />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route
            path="/questionnaire/:questionIndex"
            element={<Questionnaire />}
          />
          <Route path="/waiting" element={<WaitingAreaScreen />} />
          <Route path="/arena" element={<GameArenaPage />} />
          <Route path="/completion" element={<GameCompletionPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default GameMain;
