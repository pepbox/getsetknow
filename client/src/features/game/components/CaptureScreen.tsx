import React, { useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Webcam from "react-webcam";
import GlobalButton from "../../../components/ui/button";
import GameHeader from "../../../components/layout/GameHeader";

const CaptureScreen: React.FC = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const handleConfirm = () => {
    navigate("/game/questionnaire");
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <GameHeader/>

      {/* Character Images */}
      <Box
        sx={{
          height: "300px",
          position: "relative",
          mb: 1,
          bgcolor: "primary.main",  
        }}
      >
        {/* Left character */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "90px",
            height: "125px",
            zIndex: 1,
          }}
        >
          <Box
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            src="/src/assets/capture_asset1.png"
            alt="Character 1"
          />
        </Box>

        {/* Center character (main) - positioned higher */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "0",
            transform: "translateX(-50%)",
            width: "170px",
            height: "162px",
            zIndex: 2,
          }}
        >
          <Box
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            src="/src/assets/capture_asset2.png"
            alt="Main character"
          />
        </Box>

        {/* Right character */}
        <Box
          sx={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "100px",
            height: "126px",
            zIndex: 1,
          }}
        >
          <Box
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            src="/src/assets/capture_asset3.png"
            alt="Character 3"
          />
        </Box>
      </Box>

      {/* Main Content Container */}
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          transform: "translateX(30%)",
          widht: "250px",
          height: "250px",
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
          bottom: 10,
          left: 0,
          right: 0,
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
