import React, { useEffect } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import artist from "../../../assets/artist.png";
import music from "../../../assets/music.png";
import dance from "../../../assets/Dance.png";
import adventure from "../../../assets/adventure.png";
import uiux from "../../../assets/uiux.png";
import foodie from "../../../assets/foodie.png";
import photographer from "../../../assets/photographer.png";
import music2 from "../../../assets/music2.png";

interface Player {
  id: number;
  name: string;
  imageUrl: string;
}

interface CircularPlayerAnimationProps {
  radius?: number;
  duration?: number;
  size?: number;
}

const WaitingAreaScreen: React.FC<CircularPlayerAnimationProps> = ({
  radius = Math.min(window.innerWidth, 480) / 2 - 50,
  duration = 10,
  size = (Math.min(window.innerWidth, 480) / 2 - 25) / 2,
}) => {
  const isGameStarted = useAppSelector(
    (state: RootState) => state.game.isGameStarted
  );
  const GameCompleted = useAppSelector(
    (state: RootState) => state.gameArena.gameCompleted
  );
  const { sessionId } = useAppSelector((state: RootState) => state.game);
  const navigate = useNavigate();

  const players: Player[] = [
    {
      id: 1,
      name: "Artist",
      imageUrl: artist,
    },
    {
      id: 2,
      name: "Music",
      imageUrl: music,
    },
    {
      id: 3,
      name: "Dance",
      imageUrl: dance,
    },
    {
      id: 4,
      name: "Adventurer",
      imageUrl: adventure,
    },
    {
      id: 5,
      name: "UI/UX",
      imageUrl: uiux,
    },
    {
      id: 6,
      name: "Foodie",
      imageUrl: foodie,
    },
    {
      id: 7,
      name: "Photographer",
      imageUrl: photographer,
    },
    {
      id: 8,
      name: "Developer",
      imageUrl: music2,
    },
  ];
  // Ensure we only use 8 players
  const playersToShow = players.slice(0, 8);

  const getPlayerPosition = (index: number) => {
    const angle = (index * 360) / 8;
    const radian = (angle * Math.PI) / 180;

    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  useEffect(() => {
    if (GameCompleted) {
      navigate(`/game/${sessionId}/completion`, { replace: true });
    } else if (isGameStarted) {
      navigate(`/game/${sessionId}/arena`, { replace: true });
    }
  }, [GameCompleted, isGameStarted, navigate, sessionId]);

  return (
    <Box
      sx={{
        overflow: "hidden",
        position: "relative",
        // width: (radius + size) * 1.8,
        width: "100%",
        // height: (radius + size) * 1.8,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        margin: "0 auto",
      }}
    >
      <Typography variant="h3" mt={4}>
        GetSetKnow!
      </Typography>
      {/* Center circle indicator (optional) */}
      <Box
        sx={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h5" textAlign={"center"} color="text.primary">
          Waiting for <br />
          players.
        </Typography>
      </Box>

      {/* Rotating container */}
      <motion.div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {playersToShow.map((player, index) => {
          const position = getPlayerPosition(index);

          return (
            <motion.div
              key={player.id}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
              }}
              initial={{
                x: position.x,
                y: position.y,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                rotate: -360,
                x: position.x,
                y: position.y,
                translateX: "-50%",
                translateY: "-50%",
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Avatar
                src={player.imageUrl}
                alt={player.name}
                sx={{
                  width: size,
                  height: size,
                  border: "3px solid #fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    zIndex: 10,
                  },
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </Box>
  );
};

export default WaitingAreaScreen;
