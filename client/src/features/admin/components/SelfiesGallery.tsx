import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Paper,
} from "@mui/material";
import { SelfieData } from "../types/interfaces";

interface SelfiesGalleryProps {
  selfies: SelfieData[];
}

const SelfiesGallery: React.FC<SelfiesGalleryProps> = ({ selfies }) => {
  if (selfies.length === 0) {
    return (
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
          textAlign="center"
          color="primary"
        >
          Guess Selfies
        </Typography>
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
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        textAlign="center"
        color="primary"
      >
        Guess Selfies
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 2,
        }}
      >
        {selfies.map((selfie) => (
          <Card
            key={selfie.id}
            sx={{
              borderRadius: "12px",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={
                selfie.selfieId ? selfie.selfieId : "/placeholder-selfie.jpg"
              }
              alt={`${selfie.guesserName} guessed ${selfie.guessedPersonName}`}
              sx={{
                objectFit: "cover",
                backgroundColor: "#f5f5f5",
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-selfie.jpg";
              }}
            />
            <CardContent sx={{ p: 2, textAlign: "center" }}>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "0.875rem",
                }}
              >
                {selfie.guesserName}
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                fontWeight="medium"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "0.875rem",
                }}
              >
                {selfie.guessedPersonName}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default SelfiesGallery;
