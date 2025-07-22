import express from "express";
import playerRoutes from "../../modules/players/routes/player.routes";
// import adminRoutes from "../../modules/admin/route/admin.route";


const router = express.Router();

router.use("/player", playerRoutes);
// router.use("/admin", adminRoutes);



export default router;
