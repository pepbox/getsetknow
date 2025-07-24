import { Route, Routes } from "react-router-dom";
import DashboardPage from "../features/admin/Pages/DshboardPage";
import Box from "@mui/material/Box";

const AdminMain = () => {
  return (
    <Box sx={{ maxWidth: "100%", minHeight: "100vh" }}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </Box>
  );
};

export default AdminMain;
