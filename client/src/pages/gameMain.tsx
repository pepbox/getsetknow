import { Route, Routes } from "react-router-dom";
import HomeScreen from "../features/game/components/HomeScreen";
import CaptureScreen from "../features/game/components/CaptureScreen";
import IntroScreen from "../features/game/components/IntroScreen";
import QuestionnaireScreen from "../features/game/components/QuestionnaireScreen";
import WaitingAreaScreen from "../features/game/components/WaitingAreaScreen";

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
        <Route path="/questionnaire" element={<QuestionnaireScreen />} />
        <Route path="/waiting" element={<WaitingAreaScreen />} />
      </Routes>
    </div>
  );
};

export default GameMain;
