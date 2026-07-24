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
  ListItemText,
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
  useFetchSessionTeamsQuery,
  useCreateBulkTeamsMutation,
  useAddSingleTeamMutation,
  useDeleteSingleTeamMutation,
} from "../services/admin.Api";

interface ManageTeamsModalProps {
  open: boolean;
  onClose: () => void;
  gameStatus?: string;
}

const ManageTeamsModal: React.FC<ManageTeamsModalProps> = ({
  open,
  onClose,
  gameStatus = "pending",
}) => {
  const { data: teams = [], isLoading, isError, refetch } = useFetchSessionTeamsQuery(undefined, { skip: !open });
  const [createBulkTeams, { isLoading: isBulking }] = useCreateBulkTeamsMutation();
  const [addSingleTeam, { isLoading: isAdding }] = useAddSingleTeamMutation();
  const [deleteSingleTeam, { isLoading: isDeleting }] = useDeleteSingleTeamMutation();

  const [bulkCount, setBulkCount] = useState<number | "">("");
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<{ id: string; teamNumber: number } | null>(null);

  const [addConfirmOpen, setAddConfirmOpen] = useState(false);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  const handleBulkCreate = async () => {
    if (!bulkCount || bulkCount < 1) {
      setFormError("Please enter a valid number of teams.");
      return;
    }
    setFormError("");
    setSuccessMsg("");
    try {
      await createBulkTeams({ count: Number(bulkCount) }).unwrap();
      setSuccessMsg(`Successfully created ${bulkCount} teams.`);
      setBulkCount("");
      refetch();
    } catch (err: any) {
      console.error("Failed to bulk create teams:", err);
      setFormError(err?.data?.message || "Failed to bulk create teams.");
    } finally {
      setBulkConfirmOpen(false);
    }
  };

  const handleAddSingle = async () => {
    setFormError("");
    setSuccessMsg("");
    try {
      await addSingleTeam().unwrap();
      setSuccessMsg("New team added successfully.");
      refetch();
    } catch (err: any) {
      console.error("Failed to add team:", err);
      setFormError(err?.data?.message || "Failed to add team.");
    } finally {
      setAddConfirmOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!teamToDelete) return;
    setFormError("");
    setSuccessMsg("");
    try {
      await deleteSingleTeam(teamToDelete.id).unwrap();
      setSuccessMsg(`Team ${teamToDelete.teamNumber} deleted successfully.`);
      refetch();
    } catch (err: any) {
      console.error("Failed to delete team:", err);
      setFormError(err?.data?.message || "Failed to delete team.");
    } finally {
      setDeleteConfirmOpen(false);
      setTeamToDelete(null);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
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
            Configure Session Teams
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Manage teams for this session. The game cannot start until at least one team has been created. Empty teams will automatically be removed when the game starts.
          </Typography>

          {isError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              Failed to load teams. Please check server connection.
            </Alert>
          )}

          {formError && <Alert severity="error">{formError}</Alert>}
          {successMsg && <Alert severity="success">{successMsg}</Alert>}

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ maxHeight: 240, overflowY: "auto", border: "1px solid #e0e0e0", borderRadius: 1 }}>
              <List dense>
                {teams.length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", textAlign: "center" }}>
                          No teams created yet.
                        </Typography>
                      }
                    />
                  </ListItem>
                ) : (
                  teams.map((team) => (
                    <ListItem
                      key={team.id}
                      dense
                      sx={{
                        borderBottom: "1px solid #f0f0f0",
                        "&:last-child": { borderBottom: "none" },
                      }}
                    >
                      <ListItemText
                        primary={<Typography variant="body1" fontWeight="bold">Team {team.teamNumber}</Typography>}
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Players Assigned: {team.playerCount}
                          </Typography>
                        }
                      />
                      {gameStatus === "pending" && (
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          disabled={isDeleting}
                          onClick={() => {
                            if (team.playerCount > 0) {
                              setFormError(`Cannot delete Team ${team.teamNumber} because it has players assigned.`);
                              return;
                            }
                            setTeamToDelete({ id: team.id, teamNumber: team.teamNumber });
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon color={team.playerCount > 0 ? "disabled" : "error"} />
                        </IconButton>
                      )}
                    </ListItem>
                  ))
                )}
              </List>
            </Box>
          )}

          {gameStatus === "pending" && (
            <>
              <Divider />

              {/* Bulk Creation Section */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Create Teams in Bulk
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" } }}>
                  <TextField
                    label="Number of Teams (e.g. 10)"
                    variant="outlined"
                    type="number"
                    size="small"
                    fullWidth
                    value={bulkCount}
                    onChange={(e) => setBulkCount(e.target.value === "" ? "" : Number(e.target.value))}
                    disabled={isBulking}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isBulking || !bulkCount || bulkCount < 1}
                    onClick={() => setBulkConfirmOpen(true)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                      minWidth: { xs: "100%", sm: 120 },
                      whiteSpace: "nowrap",
                      height: "40px"
                    }}
                  >
                    Set Teams
                  </Button>
                </Box>
              </Box>

              <Divider />

              {/* Add Single Team Section */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Or add teams one-by-one
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  disabled={isAdding}
                  onClick={() => setAddConfirmOpen(true)}
                  sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
                >
                  Add Team
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete Team</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>Team {teamToDelete?.teamNumber}</strong>? Remaining teams will be sequentially re-indexed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Single Team Confirmation */}
      <Dialog open={addConfirmOpen} onClose={() => setAddConfirmOpen(false)}>
        <DialogTitle>Confirm Add Team</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to add a new team to this session?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddConfirmOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAddSingle} color="primary" variant="contained" disabled={isAdding}>
            {isAdding ? <CircularProgress size={20} color="inherit" /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Creation Confirmation */}
      <Dialog open={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)}>
        <DialogTitle>Confirm Set Teams</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Setting teams to {bulkCount} will remove any currently configured empty teams. Teams with active players will be preserved. Proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkConfirmOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleBulkCreate} color="primary" variant="contained" disabled={isBulking}>
            {isBulking ? <CircularProgress size={20} color="inherit" /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageTeamsModal;
