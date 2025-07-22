import React, { useEffect } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";

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
  const isGameStarted =
    useAppSelector((state) => state.game.isGameStarted) || true;
  const navigate = useNavigate();
  useEffect(() => {
    if (isGameStarted) navigate("/game/arena");
  }, [isGameStarted]);

  const players: Player[] = [
    {
      id: 1,
      name: "Artist",
      imageUrl: "/src/assets/artist.png",
    },
    {
      id: 2,
      name: "Music",
      imageUrl: "/src/assets/music.png",
    },
    {
      id: 3,
      name: "Dance",
      imageUrl: "/src/assets/Dance.png",
    },
    {
      id: 4,
      name: "Adventurer",
      imageUrl: "/src/assets/adventure.png",
    },
    {
      id: 5,
      name: "UI/UX",
      imageUrl: "/src/assets/uiux.png",
    },
    {
      id: 6,
      name: "Foodie",
      imageUrl: "/src/assets/foodie.png",
    },
    {
      id: 7,
      name: "Photographer",
      imageUrl: "/src/assets/photographer.png",
    },
    {
      id: 8,
      name: "Developer",
      imageUrl: "/src/assets/music2.png",
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
