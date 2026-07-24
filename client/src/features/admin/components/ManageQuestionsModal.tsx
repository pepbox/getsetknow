import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useFetchSessionQuestionsQuery,
  useSelectSessionQuestionsMutation,
  useAddCustomQuestionMutation,
  useDeleteCustomQuestionMutation,
} from "../services/admin.Api";

interface ManageQuestionsModalProps {
  open: boolean;
  onClose: () => void;
  gameStatus?: string;
}

const ManageQuestionsModal: React.FC<ManageQuestionsModalProps> = ({
  open,
  onClose,
  gameStatus = "pending",
}) => {
  const { data: questions = [], isLoading, isError, refetch } = useFetchSessionQuestionsQuery(undefined, { skip: !open });
  const [selectQuestions, { isLoading: isUpdating }] = useSelectSessionQuestionsMutation();
  const [addCustomQuestion, { isLoading: isAdding }] = useAddCustomQuestionMutation();
  const [deleteCustomQuestion, { isLoading: isDeleting }] = useDeleteCustomQuestionMutation();

  const [questionText, setQuestionText] = useState("");
  const [keyAspect, setKeyAspect] = useState("");
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!questionToDelete) return;
    try {
      await deleteCustomQuestion(questionToDelete).unwrap();
      setSuccessMsg("Question deleted successfully!");
      refetch();
    } catch (err: any) {
      console.error("Failed to delete question:", err);
      setFormError(err?.data?.message || "Failed to delete question.");
    } finally {
      setDeleteConfirmOpen(false);
      setQuestionToDelete(null);
    }
  };

  const handleToggleQuestion = async (questionId: string, currentlySelected: boolean) => {
    if (gameStatus !== "pending") return;
    // Collect all currently selected questions
    const selectedIds = questions
      .filter((q) => q.isSelected)
      .map((q) => q.id);

    const newSelectedIds = currentlySelected
      ? selectedIds.filter((id) => id !== questionId)
      : [...selectedIds, questionId];

    try {
      await selectQuestions({ questionIds: newSelectedIds }).unwrap();
    } catch (err) {
      console.error("Failed to update active questions:", err);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (!questionText.trim()) {
      setFormError("Question text is required.");
      return;
    }

    // Auto-generate key aspect if not provided
    let finalKeyAspect = keyAspect.trim();
    if (!finalKeyAspect) {
      finalKeyAspect = questionText
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Remove non-alphanumeric except spaces
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .substring(0, 30); // Limit length
    }

    if (!finalKeyAspect) {
      setFormError("Could not auto-generate key aspect. Please provide one.");
      return;
    }

    try {
      await addCustomQuestion({
        questionText: questionText.trim(),
        keyAspect: finalKeyAspect,
      }).unwrap();

      setQuestionText("");
      setKeyAspect("");
      setSuccessMsg("Custom question added and selected successfully!");
      refetch();
    } catch (err: any) {
      console.error("Failed to add custom question:", err);
      setFormError(err?.data?.message || "Failed to add custom question.");
    }
  };

  return (
    <>
      <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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
        <Typography variant="h5" fontWeight="bold">
          Customize Questionnaire Questions
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Select the questions you want to present to players during the onboarding questionnaire.
          Adding a custom question makes it active instantly for this session.
        </Typography>

        {isError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Failed to load questions. Please check server connection.
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ maxHeight: 380, overflowY: "auto", border: "1px solid #e0e0e0", borderRadius: 1, p: 1 }}>
            {/* Default Questions Section */}
            <Typography variant="subtitle2" color="primary" sx={{ px: 2, py: 1, fontWeight: "bold" }}>
              Default Questions (Cannot be deleted)
            </Typography>
            <List dense>
              {questions.filter((q) => q.isDefault).map((question) => {
                const labelId = `checkbox-list-label-${question.id}`;
                return (
                  <ListItem
                    key={question.id}
                    dense
                    onClick={() => handleToggleQuestion(question.id, question.isSelected)}
                    sx={{
                      cursor: gameStatus === "pending" ? "pointer" : "default",
                      "&:hover": { backgroundColor: gameStatus === "pending" ? "#f5f5f5" : "inherit" },
                      borderBottom: "1px solid #f0f0f0",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox
                        edge="start"
                        checked={question.isSelected}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                        disabled={isUpdating || gameStatus !== "pending"}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={labelId}
                      primary={<Typography variant="body1">{question.questionText}</Typography>}
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Key Aspect: {question.keyAspect}
                        </Typography>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>

            <Divider sx={{ my: 1 }} />

            {/* Custom Questions Section */}
            <Typography variant="subtitle2" color="secondary" sx={{ px: 2, py: 1, fontWeight: "bold" }}>
              Custom Questions
            </Typography>
            <List dense>
              {questions.filter((q) => !q.isDefault).length === 0 ? (
                <ListItem>
                  <ListItemText primary={<Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", pl: 4 }}>No custom questions added yet.</Typography>} />
                </ListItem>
              ) : (
                questions.filter((q) => !q.isDefault).map((question) => {
                  const labelId = `checkbox-list-label-${question.id}`;
                  return (
                    <ListItem
                      key={question.id}
                      dense
                      onClick={() => handleToggleQuestion(question.id, question.isSelected)}
                      sx={{
                        cursor: gameStatus === "pending" ? "pointer" : "default",
                        "&:hover": { backgroundColor: gameStatus === "pending" ? "#f5f5f5" : "inherit" },
                        borderBottom: "1px solid #f0f0f0",
                        "&:last-child": { borderBottom: "none" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Checkbox
                          edge="start"
                          checked={question.isSelected}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                          disabled={isUpdating || gameStatus !== "pending"}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={<Typography variant="body1">{question.questionText}</Typography>}
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Key Aspect: {question.keyAspect}
                          </Typography>
                        }
                      />
                      {gameStatus === "pending" && (
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          disabled={isDeleting}
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuestionToDelete(question.id);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      )}
                    </ListItem>
                  );
                })
              )}
            </List>
          </Box>
        )}

        {gameStatus === "pending" && (
          <>
            <Divider />

            {/* Add Custom Question Form */}
            <Box component="form" onSubmit={handleAddQuestion} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Add a New Custom Question
              </Typography>

              {formError && <Alert severity="error">{formError}</Alert>}
              {successMsg && <Alert severity="success">{successMsg}</Alert>}

              <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                <TextField
                  label="Question Text (e.g. Where is your dream vacation destination?)"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  disabled={isAdding}
                />
                <TextField
                  label="Key Aspect ID (e.g. dream_vacation - optional)"
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: { sm: 260 } }}
                  value={keyAspect}
                  onChange={(e) => setKeyAspect(e.target.value)}
                  disabled={isAdding}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isAdding ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
                disabled={isAdding || !questionText.trim()}
                sx={{ alignSelf: "flex-end", textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
              >
                Add Question
              </Button>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" color="primary" sx={{ textTransform: "none", borderRadius: "8px" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this question? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageQuestionsModal;
