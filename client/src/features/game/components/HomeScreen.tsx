import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Snackbar, TextField, Typography } from "@mui/material";
import { useAppDispatch } from "../../../app/hooks";
import { setPlayers, setQuestions } from "../services/gameSlice";
import GlobalButton from "../../../components/ui/button";
import { mockPlayers, mockQuestions } from "../../../data/mockData";

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [firstname, setFirstname] = React.useState<string>("");
  const [lastname, setLastname] = React.useState<string>("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    dispatch(setPlayers(mockPlayers));
    dispatch(setQuestions(mockQuestions));
  }, [dispatch]);

  const handleStart = () => {
    if (!firstname || !lastname) {
      setShowSnackbar(true);
      return;
    }
    // const playerName = `${firstname} ${lastname}`;
    navigate("/game/capture");
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <Box
      position={"absolute"}
      sx={{
        maxWidth: "480px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: "text.primary",
          fontSize: "48px",
          textAlign: "center",
        }}
      >
        GetSetKnow!
      </Typography>

      <Box
        component="img"
        sx={{
          width: "100%",
          objectFit: "cover",
        }}
        src="/src/assets/homescreenBanner.png"
        alt="Game image"
      />

      <Box
        position={"relative"}
        sx={{
          bottom: "110px",
          borderRadius: 2,
          background: "linear-gradient(180deg, #A78BFA 0%, #3622C9 100%)",
          padding: "2px",
          mx: "55px",
        }}
      >
        <Box
          sx={{
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: "16px 12px",
            }}
          >
            <TextField
              placeholder="First Name"
              variant="outlined"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <TextField
              placeholder="Last Name"
              variant="outlined"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              px: 3,
              pb: 2,
            }}
          >
            <GlobalButton onClick={handleStart} disabled={!firstname || !lastname}>Start</GlobalButton>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Please enter both first and last names.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomeScreen;
