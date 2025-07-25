import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import {
  useFetchDashboardDataQuery,
  useUpdatePlayerMutation,
} from "../services/admin.Api";
import Loader from "../../../components/ui/Loader";
import ErrorLayout from "../../../components/ui/Error";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const DashboardPage: React.FC = () => {
  const { data, isError, isLoading } = useFetchDashboardDataQuery({});
  const [UpdatePlayer] = useUpdatePlayerMutation();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handlers = {
    onChangeName: (playerId: string, name: string) => {
      UpdatePlayer({ playerId, name })
        .unwrap()
        .then(() => {
          setSnackbar({
            open: true,
            message: "Player name updated successfully",
            severity: "success",
          });
        })
        .catch((error) => {
          setSnackbar({
            open: true,
            message: "Failed to update player name",
            severity: "error",
          });
          console.error("Failed to update player name:", error);
        });
      console.log("Change name for player:", playerId);
    },
    onViewResponses: (playerId: string) => {
      console.log("View responses for player:", playerId);
    },
  };

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <ErrorLayout />;
  }
  return (
    <>
      <Dashboard
        headerData={data.headerData}
        players={data.players}
        onChangeName={handlers?.onChangeName}
        onViewResponses={handlers?.onViewResponses}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DashboardPage;
