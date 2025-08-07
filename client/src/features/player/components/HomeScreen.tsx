import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Snackbar,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import GlobalButton from "../../../components/ui/button";
import { setPlayer } from "../services/player.slice";
import { RootState } from "../../../app/store";
import homescreenBanner from "../../../assets/homescreenBanner.png";
import { useGetAllTeamsQuery } from "../services/player.api";

const HomeScreen: React.FC = () => {
  const { isAuthenticated } = useAppSelector(
    (state: RootState) => state.player
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [firstname, setFirstname] = React.useState<string>("");
  const [lastname, setLastname] = React.useState<string>("");
  const [selectedTeam, setSelectedTeam] = React.useState<number | "">("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { sessionId } = useAppSelector((state: RootState) => state.game);
  const {
    data: teams,
    isError,
    isLoading,
  } = useGetAllTeamsQuery(sessionId, {
    skip: !sessionId,
  });

  const MAX_NAME_LENGTH = 20;

  // Validation function to check if input contains only letters and spaces
  const validateName = (name: string): string => {
    if (name.length > MAX_NAME_LENGTH) {
      return `Name must be ${MAX_NAME_LENGTH} characters or less`;
    }
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      return "Name can only contain letters and spaces";
    }
    return "";
  };

  const handleFirstnameChange = (value: string) => {
    // Only allow letters and spaces, and respect character limit
    if (/^[a-zA-Z\s]*$/.test(value) && value.length <= MAX_NAME_LENGTH) {
      setFirstname(value);
    }
  };

  const handleLastnameChange = (value: string) => {
    // Only allow letters and spaces, and respect character limit
    if (/^[a-zA-Z\s]*$/.test(value) && value.length <= MAX_NAME_LENGTH) {
      setLastname(value);
    }
  };

  const handleStart = () => {
    const firstnameValidation = validateName(firstname.trim());
    const lastnameValidation = validateName(lastname.trim());

    if (!firstname.trim() || !lastname.trim() || selectedTeam === "") {
      setShowSnackbar(true);
      return;
    }

    if (firstnameValidation || lastnameValidation) {
      return;
    }

    const playerName = `${firstname.trim()} ${lastname.trim()}`;
    dispatch(
      setPlayer({
        name: playerName,
        teamNumber: selectedTeam as number,
      })
    );
    navigate(`/game/${sessionId}/capture`);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  if (isAuthenticated) {
    return <Navigate to={`/game/${sessionId}/questionnaire`} replace />;
  }
  return (
    <Box
      position={"absolute"}
      sx={{
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflowY: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 4,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: "text.primary",
          fontSize: "36px",
          textAlign: "center",
        }}
      >
        GetSetKnow!
      </Typography>

      <Box
        component="img"
        sx={{
          maxHeight: "380px",
          objectFit: "cover",
        }}
        src={homescreenBanner}
        alt="Game image"
      />

      <Box
        position={"relative"}
        sx={{
          bottom: "170px",
          borderRadius: 2,
          background: "linear-gradient(180deg, #A78BFA 0%, #3622C9 100%)",
          padding: "2px",
          mx: "55px",
          maxHeight: "400px",
        }}
      >
        <Box
          sx={{
            borderRadius: 2,
            backgroundColor: "background.paper",
            maxHeight: "396px",
            overflowY: "auto",
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
              onChange={(e) => handleFirstnameChange(e.target.value)}
            />
            <TextField
              placeholder="Last Name"
              variant="outlined"
              value={lastname}
              onChange={(e) => handleLastnameChange(e.target.value)}
            />

            {/* Teams Dropdown */}
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Select Team</InputLabel>
              <Select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value as number)}
                label="Select Team"
                disabled={isLoading}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                    },
                  },
                }}
              >
                {isLoading ? (
                  <MenuItem disabled>Loading teams...</MenuItem>
                ) : isError ? (
                  <MenuItem disabled>Error loading teams</MenuItem>
                ) : teams && teams.length > 0 ? (
                  teams.map((_: any, index: number) => (
                    <MenuItem key={index} value={index + 1}>
                      Team {index + 1}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No teams available</MenuItem>
                )}
              </Select>
            </FormControl>
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
            <GlobalButton
              fullWidth
              onClick={handleStart}
              disabled={
                !firstname.trim() || !lastname.trim() || selectedTeam === ""
              }
            >
              Start
            </GlobalButton>
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
          Please enter both first and last names and select a team.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomeScreen;
