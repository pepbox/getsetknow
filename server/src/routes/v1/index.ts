import express from "express";
import playerRoutes from "../../modules/players/routes/player.routes";
import adminRoutes from "../../modules/admin/routes/admin.routes";
import sessionRoutes from "../../modules/session/routes/session.route";
import serverRoutes from "../../modules/session/routes/server.routes";

const router = express.Router();

router.use("/player", playerRoutes);
router.use("/admin", adminRoutes);
router.use("/session", sessionRoutes);
router.use("/server", serverRoutes);

export default router;
