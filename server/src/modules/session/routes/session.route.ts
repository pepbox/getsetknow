import express from 'express';
import asyncHandeler from 'express-async-handler';
import * as sessionControllers from '../controllers/session.controller';
import { authenticateUser, authorizeRoles } from '../../../middlewares/authMiddleware';
import { uploadMiddleware } from '../../../services/fileUpload';

const router = express.Router();

router.put('/update', authenticateUser, asyncHandeler(sessionControllers.updateSession));
router.get('/getSession', authenticateUser, asyncHandeler(sessionControllers.getSession));
router.get('/public/:sessionId', asyncHandeler(sessionControllers.getPublicSession));
router.get('/download-selfies/:sessionId', authenticateUser, asyncHandeler(sessionControllers.downloadSessionSelfies));
router.put('/branding', authenticateUser, authorizeRoles("ADMIN"), uploadMiddleware.single("companyLogo", {
  allowedMimeTypes: ["image/jpeg", "image/png", "image/gif"],
  maxFileSize: 5 * 1024 * 1024, // 5MB limit
  folder: "branding-logos",
}), asyncHandeler(sessionControllers.updateBranding));

export default router;
