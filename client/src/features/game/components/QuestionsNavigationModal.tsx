import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Guess {
  guessId: string;
  status: "correct" | "wrong" | "no guess";
  guessedPersonId?: string;
}

interface QuestionsNavigationModalProps {
  open: boolean;
  onClose: () => void;
  guesses: Guess[];
  currentQuestionIndex: number;
  onNavigateToQuestion: (questionIndex: number) => void;
  loading?: boolean;
}

const QuestionsNavigationModal: React.FC<QuestionsNavigationModalProps> = ({
  open,
  onClose,
  guesses,
  currentQuestionIndex,
  onNavigateToQuestion,
  loading = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "correct":
        return "#4CAF50"; // Green
      case "wrong":
        return "#F44336"; // Red
      case "no guess":
        return "#9E9E9E"; // Grey
      default:
        return "#9E9E9E";
    }
  };

  // const getStatusText = (status: string) => {
  //   switch (status) {
  //     case "correct":
  //       return "Correct";
  //     case "wrong":
  //       return "Wrong";
  //     case "no guess":
  //       return "Unanswered";
  //     default:
  //       return "Unknown";
  //   }
  // };

  const handleQuestionClick = (index: number, status: string) => {
    // Don't allow navigation if the question is already answered correctly
    if (status === "correct") {
      return;
    }

    onNavigateToQuestion(index);
    onClose(); // Close modal after navigation
  };

  const isClickable = (status: string) => status !== "correct";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            m: 2,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" component="div">
          Cards
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Summary */}
        {!loading && guesses.length > 0 && (
          <Box sx={{ mb: 3, pt: 1, borderTop: "1px solid #e0e0e0" }}>
            <Typography variant="body2" color="text.secondary">
              Total Cards: {guesses.length} | Correct:{" "}
              {guesses.filter((g) => g.status === "correct").length} | Wrong:{" "}
              {guesses.filter((g) => g.status === "wrong").length} | Skipped:{" "}
              {guesses.filter((g) => g.status === "no guess").length}
            </Typography>
          </Box>
        )}

        {/* Questions Grid */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Loading questions...
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {guesses.map((guess, index) => {
              const isCurrent = index === currentQuestionIndex;
              const clickable = isClickable(guess.status);

              return (
                <Grid size={{ xs: 3, sm: 2 }} key={guess.guessId}>
                  <Box
                    onClick={() => handleQuestionClick(index, guess.status)}
                    sx={{
                      width: "100%",
                      height: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1,
                      backgroundColor: getStatusColor(guess.status),
                      cursor: clickable ? "pointer" : "not-allowed",
                      opacity: clickable ? 1 : 0.7,
                      border: isCurrent ? "3px solid #1976d2" : "none",
                      boxShadow: isCurrent
                        ? "0 0 0 2px rgba(25, 118, 210, 0.2)"
                        : "none",
                      transition: "all 0.2s ease",
                      "&:hover": clickable
                        ? {
                            transform: "scale(1.05)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          }
                        : {},
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                      }}
                    >
                      {index + 1}
                    </Typography>

                    {/* Current question indicator */}
                    {isCurrent && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -2,
                          right: -2,
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: "#1976d2",
                          border: "2px solid white",
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Legend */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Legend:
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#4CAF50",
                  borderRadius: 0,
                  border: "1px solid #388E3C",
                }}
              />
              <Typography variant="body2">Correct</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#F44336",
                  borderRadius: 0,
                  border: "1px solid #B71C1C",
                }}
              />
              <Typography variant="body2">Wrong</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#9E9E9E",
                  // borderRadius: 1,
                  border: "1px solid #616161",
                }}
              />
              <Typography variant="body2">Skipped/Unanswered</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionsNavigationModal;
