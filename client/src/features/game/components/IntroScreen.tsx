import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import GlobalButton from "../../../components/ui/button";

const IntroScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleJumpIn = () => {
    navigate("/questionnaire");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#8B5CF6",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ color: "white", ml: 2, fontWeight: "bold" }}
        >
          GetSetKnow!
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mb: 4,
          }}
          src="/assets/images/intro-avatar.jpg"
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: 350,
            bgcolor: "white",
            borderRadius: 2,
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
            Ready to be the mystery?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "#666",
              mb: 3,
            }}
          >
            Spill some fun facts about yourself...
          </Typography>

          <GlobalButton
            onClick={handleJumpIn}
            sx={{
              bgcolor: "#10B981",
              "&:hover": { bgcolor: "#059669" },
            }}
          >
            Jump in
          </GlobalButton>
        </Box>
      </Box>
    </Box>
  );
};

export default IntroScreen;
