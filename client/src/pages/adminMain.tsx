import { Route, Routes, useParams } from "react-router-dom";
import DashboardPage from "../features/admin/Pages/DshboardPage";
import LeaderboardPage from "../features/admin/Pages/LeaderboardPage";
import AdminLogin from "../features/admin/Pages/AdminLogin";
import Box from "@mui/material/Box";
import { useLazyFetchAdminQuery } from "../features/admin/services/admin.Api";
import { useEffect } from "react";
import Loader from "../components/ui/Loader";
import AuthWrapper from "../components/auth/AuthWrapper";
import { useAppDispatch } from "../app/rootReducer";
import { setSessionId } from "../features/game/services/gameSlice";

const AdminMain = () => {
  const [FetchAdmin, { isLoading: isQueryLoading, isUninitialized }] = useLazyFetchAdminQuery();
  const dispatch = useAppDispatch();
  const sessionId = useParams<{ sessionId: string }>().sessionId;

  useEffect(() => {
    dispatch(setSessionId(sessionId ?? ""));
  }, [sessionId, dispatch]);

  useEffect(() => {
    FetchAdmin({});
  }, [FetchAdmin]);

  if (isQueryLoading || isUninitialized) {
    return <Loader />;
  }

  return (
    <Box sx={{ maxWidth: "100%", minHeight: "100vh" }}>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/"
          element={
            <AuthWrapper
              userType={"admin"}
              redirection={`/admin/${sessionId}/login`}
            />
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>
        <Route path={`/${sessionId}`} element={<AdminLogin />} />
      </Routes>
    </Box>
  );
};

export default AdminMain;
