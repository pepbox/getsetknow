import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Avatar as MuiAvatar, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

interface Avatar {
  id: number;
  name: string;
  images: string[];
  angle: number;
}

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.grey[50],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 2,
}));

const StyledAvatarContainer = styled(Box)({
  position: "relative",
  width: 300,
  height: 300,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "@media (min-width: 768px)": {
    width: 350,
    height: 350,
  },
});

const StyledAvatar = styled(MuiAvatar)(({ theme }) => ({
  width: 56,
  height: 56,
  border: `3px solid ${theme.palette.common.white}`,
  boxShadow: theme.shadows[4],
  background: "linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)",
  marginBottom: 1,
  position: "relative",
  overflow: "hidden",
  "@media (min-width: 768px)": {
    width: 64,
    height: 64,
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 600,
  color: theme.palette.grey[700],
  backgroundColor: theme.palette.common.white,
  boxShadow: theme.shadows[1],
  whiteSpace: "nowrap",
}));

const LoadingDot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  backgroundColor: theme.palette.primary.main,
  borderRadius: "50%",
  margin: 2,
}));

const WaitingAreaScreen: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample avatar data - replace with your actual images
  const avatars: Avatar[] = [
    {
      id: 1,
      name: "ARTIST",
      images: [
        "/src/assets/capture_asset1.png",
        "/src/assets/capture_asset2.png",
        "/src/assets/capture_asset3.png",
      ],
      angle: 0, // top
    },
    {
      id: 2,
      name: "ADVENTURER",
      images: [
        "/src/assets/capture_asset1.png",
        "/src/assets/capture_asset2.png",
        "/src/assets/capture_asset3.png",
      ],
      angle: 45, // top-right
    },
    {
      id: 3,
      name: "MUSIC",
      images: [
        "/src/assets/capture_asset1.png",
        "/src/assets/capture_asset2.png",
        "/src/assets/capture_asset3.png",
      ],
      angle: 90, // right
    },
    {
      id: 4,
      name: "PHOTOGRAPHER",
      images: [
        "/src/assets/capture_asset1.png",
        "/src/assets/capture_asset2.png",
        "/src/assets/capture_asset3.png",
      ],
      angle: 135, // bottom-right
    },
    {
      id: 5,
      name: "FOODIE",
      images: [
        "/src/assets/capture_asset1.png",
        "/src/assets/capture_asset2.png",
        "/src/assets/capture_asset3.png",
      ],
      angle: 180, // bottom
    },
    {
      id: 6,
      name: "UI/UX",
      images: [
        "/src/assets/capture_asset1.png",
        "/src/assets/capture_asset2.png",
        "/src/assets/capture_asset3.png",
      ],
      angle: 225, // bottom-left
    },
    {
      id: 7,
      name: "DANCE",
      images: [
        "/src/assets/capture_asset1.png",
        "/src/assets/capture_asset2.png",
        "/src/assets/capture_asset3.png",
      ],
      angle: 270, // left
    },
    {
      id: 8,
      name: "MUSIC",
      images: [
        "/src/assets/capture_asset1.png",
        "/src/assets/capture_asset2.png",
        "/src/assets/capture_asset3.png",
      ],
      angle: 315, // top-left
    },
  ];

  // Change images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate position based on angle
  const getPosition = (angle: number, radius: number) => {
    const radian = (angle * Math.PI) / 180;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    return { x, y };
  };

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Individual avatar animation variants
  const avatarVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
      },
    },
  };

  // Image slide animation from 45-degree top
  const imageVariants = {
    enter: {
      x: -30,
      y: -30,
      opacity: 0,
      scale: 0.8,
    },
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      x: 30,
      y: 30,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const radius = 120; // Circle radius - reduced for better circular appearance

  return (
    <StyledContainer>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            mb={1}
          >
            GetSetKnow!
          </Typography>
        </Box>
      </motion.div>

      {/* Main Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StyledAvatarContainer>
          {/* Center Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Box textAlign="center" zIndex={10}>
              <Typography
                variant="h5"
                fontWeight="600"
                color="text.primary"
                mb={1}
              >
                Waiting for
                <br />
                players..
              </Typography>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight="500"
                >
                  4 of 8 ready!
                </Typography>
              </motion.div>
            </Box>
          </motion.div>

          {/* Avatars positioned around the circle */}
          {avatars.map((avatar, index) => {
            const position = getPosition(avatar.angle - 90, radius); // -90 to start from top

            return (
              <motion.div
                key={avatar.id}
                variants={avatarVariants}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Avatar Image Container */}
                <motion.div whileHover={{ scale: 1.1 }}>
                  <StyledAvatar>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={`${avatar.id}-${currentImageIndex}`}
                        src={avatar.images[currentImageIndex]}
                        alt={avatar.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        variants={imageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      />
                    </AnimatePresence>
                  </StyledAvatar>
                </motion.div>

                {/* Avatar Label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <StyledChip label={avatar.name} size="small" />
                </motion.div>
              </motion.div>
            );
          })}
        </StyledAvatarContainer>
      </motion.div>

      {/* Loading Dots Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <Box display="flex" justifyContent="center" mt={3}>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            >
              <LoadingDot />
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </StyledContainer>
  );
};

export default WaitingAreaScreen;
