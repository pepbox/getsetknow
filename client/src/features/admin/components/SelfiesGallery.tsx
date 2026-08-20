import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SelfieData } from "../types/interfaces";

interface SelfiesGalleryProps {
  selfies: SelfieData[];
  isLeaderboardOpen?: boolean;
  onToggleLeaderboard?: () => void;
}

const SelfiesGallery: React.FC<SelfiesGalleryProps> = ({
  selfies,
  isLeaderboardOpen = true,
  onToggleLeaderboard,
}) => {
  const [visibleCount, setVisibleCount] = useState(12);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };
  if (selfies.length === 0) {
    return (
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 3, position: "relative" }}>
          {!isLeaderboardOpen && onToggleLeaderboard && (
            <IconButton
              onClick={onToggleLeaderboard}
              size="small"
              sx={{
                position: "absolute",
                left: 0,
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                color: "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "rgba(167, 139, 250, 0.04)",
                },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          )}
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            sx={{ textAlign: "center" }}
          >
            Guess Selfies
          </Typography>
        </Box>
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No selfies uploaded yet. Players will see their selfies here once
            they make correct guesses!
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 3, position: "relative" }}>
        {!isLeaderboardOpen && onToggleLeaderboard && (
          <IconButton
            onClick={onToggleLeaderboard}
            size="small"
            sx={{
              position: "absolute",
              left: 0,
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "text.primary",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "rgba(167, 139, 250, 0.04)",
              },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        )}
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
          sx={{ textAlign: "center" }}
        >
          📸 Photo Gallery
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
          },
        }}
      >
        {selfies.slice(0, visibleCount).map((selfie) => (
          <Card
            key={selfie.id}
            sx={{
              borderRadius: "16px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
              border: "1px solid #E5E7EB",
              transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
              },
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={
                selfie.selfieId ? selfie.selfieId : "/placeholder-selfie.jpg"
              }
              alt={`${selfie.guesserName} guessed ${selfie.guessedPersonName}`}
              sx={{
                objectFit: "cover",
                backgroundColor: "background.default",
                height: {
                  xs: "150px",
                  sm: "170px",
                  md: "180px",
                },
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-selfie.jpg";
              }}
            />
            <CardContent sx={{ p: 2, textAlign: "center" }}>
              {/* Simple player names display */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* First player name */}
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "0.875rem",
                    color: "text.primary",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {selfie.guesserName}
                </Typography>
                
                {/* Horizontal divider line */}
                <Box
                  sx={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "divider",
                    my: 1,
                  }}
                />
                
                {/* Second player name */}
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {selfie.guessedPersonName}
                </Typography>
               </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {visibleCount < selfies.length && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                borderColor: "primary.dark",
                backgroundColor: "rgba(167, 139, 250, 0.04)",
              },
            }}
          >
            Load More Selfies
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SelfiesGallery;
