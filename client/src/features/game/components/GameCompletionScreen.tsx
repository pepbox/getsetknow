import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Container,
  Paper,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetGameCompletionDataQuery, usePlayerLogoutMutation } from "../services/gameArena.Api";
import { useLazyGetPlayerWithResponsesQuery } from "../../admin/services/admin.Api";
import { logoutPlayer } from "../../player/services/player.slice";
import PlayerResponsesModal from "../../admin/components/PlayerResponsesModal";
import Loader from "../../../components/ui/Loader";
import Error from "../../../components/ui/Error";

interface PlayerWithResponses {
  player: {
    id: string;
    name: string;
    profilePhoto?: string;
    score: number;
  };
  responses: Array<{
    questionId: string;
    keyAspect: string;
    questionText: string;
    response: string;
  }>;
}

const GameCompletionScreen: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [selectedPlayer, setSelectedPlayer] =
    useState<PlayerWithResponses | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // API calls
  const {
    data: completionData,
    isLoading,
    error,
  } = useGetGameCompletionDataQuery();
  const [getPlayerWithResponses, { isLoading: loadingPlayerResponses }] =
    useLazyGetPlayerWithResponsesQuery();
  const [playerLogout, { isLoading: loggingOut }] = usePlayerLogoutMutation();

  // Hide confetti after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayerClick = async (playerId: string) => {
    try {
      const response = await getPlayerWithResponses(playerId).unwrap();
      setSelectedPlayer({
        player: {
          id: response.player.id,
          name: response.player.name,
          profilePhoto: response.player.profilePhoto,
          score: response.player.score,
        },
        responses: response.responses,
      });
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch player responses:", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlayer(null);
  };

  const handleLogout = async () => {
    try {
      await playerLogout().unwrap();
      dispatch(logoutPlayer());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API call fails, clear local state
      dispatch(logoutPlayer());
      navigate("/");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !completionData) {
    return <Error />;
  }

  const { currentPlayer, peopleYouKnow, peopleWhoKnowYou, totalPlayers } =
    completionData;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "auto",
      }}
    >
      {/* Header with Logout */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: "transparent" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            GetSetKnow!
          </Typography>
          <IconButton
            onClick={handleLogout}
            disabled={loggingOut}
            sx={{ 
              color: "white",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
          recycle={false}
          gravity={0.3}
        />
      )}

      <Container maxWidth="md" sx={{ pt: 2, pb: 4 }}>
        {/* Header Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            mb: 3,
            // background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            bgcolor: "primary.main",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "white",
              mb: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            🎉 Game Completed! 🎉
          </Typography>

          {/* Player Profile Section */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Avatar
              src={currentPlayer.profilePhoto}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              {currentPlayer.name.charAt(0).toUpperCase()}
            </Avatar>
          </Box>

          <Typography
            variant="h4"
            sx={{ color: "white", fontWeight: "bold", mb: 1 }}
          >
            {currentPlayer.name}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Chip
              label={`Final Score: ${currentPlayer.score}`}
              sx={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                py: 2,
                px: 3,
                background: "rgba(255,255,255,0.9)",
                color: "#333",
              }}
            />
            <Chip
              label={`Rank: #${currentPlayer.rank}`}
              sx={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                py: 2,
                px: 3,
                background: "rgba(255,215,0,0.9)",
                color: "#333",
              }}
            />
          </Box>
        </Paper>

        {/* Statistics Overview */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
          >
            Game Statistics
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                {peopleYouKnow.length}
              </Typography>
              <Typography variant="body1">People You Know</Typography>
            </Box>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "secondary.main", fontWeight: "bold" }}
              >
                {peopleWhoKnowYou.length}
              </Typography>
              <Typography variant="body1">People Who Know You</Typography>
            </Box>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "success.main", fontWeight: "bold" }}
              >
                {totalPlayers}
              </Typography>
              <Typography variant="body1">Total Players</Typography>
            </Box>
          </Box>
        </Paper>

        {/* People You Know Accordion */}
        <Paper elevation={3} sx={{ mb: 2, borderRadius: 3 }}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                👥 People You Know ({peopleYouKnow.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {peopleYouKnow.length > 0 ? (
                <List>
                  {peopleYouKnow.map((player) => (
                    <ListItem key={player._id} disablePadding>
                      <ListItemButton
                        onClick={() => handlePlayerClick(player._id)}
                      >
                        <ListItemAvatar>
                          <Avatar src={player.profilePhoto}>
                            {player.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={player.name}
                          secondary={`Score: ${player.score}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    You didn't guess anyone correctly this time. Better luck
                    next game! 🎯
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* People Who Know You Accordion */}
        <Paper elevation={3} sx={{ borderRadius: 3 }}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: "secondary.main",
                color: "white",
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                🎯 People Who Know You ({peopleWhoKnowYou.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {peopleWhoKnowYou.length > 0 ? (
                <List>
                  {peopleWhoKnowYou.map((player) => (
                    <ListItem key={player._id} disablePadding>
                      <ListItemButton
                        onClick={() => handlePlayerClick(player._id)}
                      >
                        <ListItemAvatar>
                          <Avatar src={player.profilePhoto}>
                            {player.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={player.name}
                          secondary={`Score: ${player.score}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    Nobody guessed you correctly this time. You're quite
                    mysterious! 🕵️
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Container>

      {/* Player Responses Modal */}
      <PlayerResponsesModal
        open={modalOpen}
        onClose={handleCloseModal}
        playerWithResponses={selectedPlayer}
        loading={loadingPlayerResponses}
      />
    </Box>
  );
};

export default GameCompletionScreen;
