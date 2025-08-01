import express from 'express';
import asyncHandeler from 'express-async-handler';
import * as playerControllers from '../controllers/player.controller';
import * as questionControllers from '../../questions/controllers/question.controller';
import { authenticateUser } from '../../../middlewares/authMiddleware';
import { uploadMiddleware } from '../../../services/fileUpload';

const router = express.Router();

router.post('/onboardPlayer',uploadMiddleware.single("profilePicture", {
    allowedMimeTypes: ["image/jpeg", "image/png", "image/gif"],
    maxFileSize: 20 * 1024 * 1024,
    folder: "profile-pictures",
  }), asyncHandeler(playerControllers.onboardPlayer));


router.get('/fetchPlayer', authenticateUser, asyncHandeler(playerControllers.fetchPlayer));
router.get('/fetchAllQuestions', authenticateUser, asyncHandeler(questionControllers.getAllQuestions));
router.post('/storeQuestionResponse', authenticateUser, asyncHandeler(questionControllers.storeQuestionResponse));
router.get('/getPlayersCards', authenticateUser, asyncHandeler(playerControllers.getPlayersCards));
router.get('/getPlayersBySession', authenticateUser, asyncHandeler(playerControllers.getPlayersBySession));
router.post('/submitGuess', authenticateUser, asyncHandeler(playerControllers.submitGuess));
router.get('/getUserGuesses', authenticateUser, asyncHandeler(playerControllers.getUserGuesses));
router.get('/getPlayerStats', authenticateUser, asyncHandeler(playerControllers.getPlayerStats));
router.get('/getGameCompletionData', authenticateUser, asyncHandeler(playerControllers.getGameCompletionData));

export default router;
