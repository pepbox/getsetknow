import { Route, Routes } from "react-router-dom";
import DashboardPage from "../features/admin/Pages/DshboardPage";
import AdminLogin from "../features/admin/Pages/AdminLogin";
// import ProtectedAdminRoute from "../features/admin/components/ProtectedAdminRoute";
import Box from "@mui/material/Box";

const AdminMain = () => {
  return (
    <Box sx={{ maxWidth: "100%", minHeight: "100vh" }}>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route 
          path="/dashboard" 
          element={
            // <ProtectedAdminRoute>
              <DashboardPage />
            // </ProtectedAdminRoute>
          } 
        />
        <Route path="/" element={<AdminLogin />} />
      </Routes>
    </Box>
  );
};

export default AdminMain;
