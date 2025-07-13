import React, { useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Webcam from "react-webcam";
import GlobalButton from "../../../components/ui/button";
import GameHeader from "../../../components/layout/GameHeader";
import ProgressComponent from "../../../components/layout/ProgressComponent";
import { useAppDispatch } from "../../../app/hooks";
import { setCurrentStep } from "../services/gameSlice";

const CaptureScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      dispatch(setCurrentStep(2));
    }
  }, [webcamRef]);

  const handleConfirm = () => {
    dispatch(setCurrentStep(3));
    navigate("/game/intro");
  };

  const handleRetake = () => {
    dispatch(setCurrentStep(1));
    setCapturedImage(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <GameHeader />
      <ProgressComponent />

      <Box
        sx={{
          bgcolor: "primary.main",
          height: "270px",
        }}
      />
      {/* Main Content Container */}
      <Box
        sx={{
          maxWidth: "270px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* White Card Container */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            p: 3,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Camera/Image Container */}
          <Box
            sx={{
              width: 220,
              height: 200,
              bgcolor: "black",
              borderRadius: 2,
              mb: 3,
              overflow: "hidden",
              border: "2px solid #f0f0f0",
            }}
          >
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={220}
                height={200}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: "50px",
        }}
      >
        {/* Text */}
        <Typography
          variant="h6"
          sx={{
            color: "black",
            mb: 3,
            textAlign: "center",
            fontWeight: "600",
            fontSize: "16px",
            lineHeight: 1.4,
          }}
        >
          Capture your smile to begin!
        </Typography>

        {/* Buttons */}
        <Box sx={{ width: "100%", px: "20px" }}>
          {capturedImage ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <GlobalButton onClick={handleConfirm}>Confirm</GlobalButton>
              <GlobalButton onClick={handleRetake}>Retake</GlobalButton>
            </Box>
          ) : (
            <GlobalButton onClick={capture}>Capture</GlobalButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CaptureScreen;
