import { Route, Routes } from "react-router-dom";
import WaitingAreaScreen from "../features/game/components/WaitingAreaScreen";
import CaptureScreen from "../features/player/components/CaptureScreen";
import HomeScreen from "../features/player/components/HomeScreen";
import IntroScreen from "../features/question/components/IntroScreen";
import Questionnaire from "../features/question/pages/Questionnaire";
import GameArenaPage from "../features/game/pages/GameArenaPage";

const GameMain = () => {
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
        <Route path="/intro" element={<IntroScreen />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/waiting" element={<WaitingAreaScreen />} />
        <Route path="/arena" element={<GameArenaPage />} />
      </Routes>
    </div>
  );
};

export default GameMain;
