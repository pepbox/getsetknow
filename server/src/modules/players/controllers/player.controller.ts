import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../utils/appError';
import PlayerService from '../services/player.service';
import { Player } from '../models/player.model';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwtUtils';
import { setCookieOptions } from '../../../utils/cookieOptions';
import QuestionService from '../../questions/services/question.service';
import { Question } from '../../questions/models/question.model';
import { Types } from 'mongoose';

const playerService = new PlayerService(Player);
const questionService = new QuestionService(Question);

export const onboardPlayer = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name,
            session,
            // profilePhoto 
        } = req.body;
        // const session = req.user?.sessionId;

        if (!name || !session) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Name and session are required",
            });
            return;
        }

        const playerData = {
            name,
            // profilePhoto,
            session,
        };

        const player = await playerService.createPlayer(playerData);
        const accessToken = generateAccessToken(player._id.toString(), "USER");
        const refreshToken = generateRefreshToken(player._id.toString());

        res.cookie("accessToken", accessToken, setCookieOptions);
        res.cookie("refreshToken", refreshToken, { ...setCookieOptions, httpOnly: true });

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Player onboarded successfully",
            data: player,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error("Error onboarding player:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal Server Error",
            });
        }
    }
};


export const getPlayersCards = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const sessionId = req.user?.sessionId || "687dedc3fbc85e571416e6c9";
        const currentUserId = req.user?.id;

        if (!sessionId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Session ID is required",
            });
            return;
        }

        // Fetch all players in the session except the current user
        const players = await playerService.getPlayersBySession(new Types.ObjectId(sessionId));
        const otherPlayers = players.filter(
            (player: any) => player._id.toString() !== currentUserId
        );

        // Prepare the result array
        const result = [];

        for (const player of otherPlayers) {
            // Get responses by player id
            const responses = await questionService.getResponsesByPlayerId(player._id.toString());

            // Map keyAspect to response
            const aspectResponseMap: Record<string, any> = {};

            for (const response of responses) {
                // Get question by id
                const question = await questionService.getQuestionById(response.question.toString());
                if (question) {
                    aspectResponseMap[question.keyAspect] = response.response;
                }
            }
            const guess = await playerService.createGuess({
                user: currentUserId,
                personId: player._id,
            })

            result.push({
                guessId: guess._id,
                responses: aspectResponseMap,
            });
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error fetching players' responses:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
};

export const getPlayersBySession = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const sessionId = req.user?.sessionId || "687dedc3fbc85e571416e6c9";
        const currentUserId = req.user?.id;

        if (!sessionId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Session ID is required",
            });
            return;
        }

        const players = await playerService.getPlayersBySession(new Types.ObjectId(sessionId));
        const filteredPlayers = players.filter(
            (player: any) => player._id.toString() !== currentUserId
        );
        res.status(StatusCodes.OK).json({
            success: true,
            data: filteredPlayers,
        });
    } catch (error) {
        console.error("Error fetching players by session:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
};

export const submitGuess = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { guessId, guessedPersonId } = req.body;

        if (!guessId || !guessedPersonId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "guessId and guessedPersonId are required",
            });
            return;
        }

        // Find the guess by ID
        const guess = await playerService.getGuessById(guessId);
        if (!guess) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Guess not found",
            });
            return;
        }

        // Check if the guess is correct
        const isCorrect = guess.personId.toString() === guessedPersonId;

        await playerService.updateGuessById(guessId, {
            guessedPersonId: guessedPersonId
        });

        res.status(StatusCodes.OK).json({
            success: true,
            correct: isCorrect,
        });
    } catch (error) {
        console.error("Error submitting guess:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
};