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
import { NextFunction } from 'express';
import { SessionEmitters } from '../../../services/socket/sessionEmitters';
import { Events } from '../../../services/socket/enums/Events';
import { deleteFromS3 } from '../../../services/fileUpload';
import SessionService from '../../session/services/session.service';
import FileService from '../../files/services/fileService';
import { SessionStatus } from '../../session/types/enums';

const playerService = new PlayerService(Player);
const questionService = new QuestionService(Question);
const fileService = new FileService();


export const onboardPlayer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name,
            session,
        } = req.body;

        if (!req.file) {
            return next(new AppError("Profile image is required.", 400));
        }

        if (!name || !session) {
            deleteFromS3(req.file.key!);
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Name and session are required",
            });
            return;
        }

        const fileService = new FileService();

        const sessionDoc = await SessionService.fetchSessionById(session);
        if (!sessionDoc) {
            deleteFromS3(req.file.key!);
            return next(new AppError("Session not found.", 404));
        }

        if (sessionDoc.status === SessionStatus.ENDED) {
            deleteFromS3(req.file.key!);
            return next(new AppError("Session has ended. Player cannot be onboarded.", 403));
        }

        const profileImageInfo = {
            originalName: req.file.originalname!,
            fileName: req.file.key!,
            size: req.file.size!,
            mimetype: req.file.mimetype!,
            location: req.file.location!,
            bucket: req.file.bucket!,
            etag: req.file.etag!,
        };

        const profileImage = await fileService.uploadFile(profileImageInfo);

        const playerData = {
            name,
            profilePhoto: profileImage._id,
            session,
        };

        const player = await playerService.createPlayer(playerData);
        const accessToken = generateAccessToken({
            id: player._id.toString(),
            role: "USER",
            sessionId: player.session.toString()
        });
        const refreshToken = generateRefreshToken(player._id.toString());

        res.cookie("accessToken", accessToken, setCookieOptions);
        res.cookie("refreshToken", refreshToken, { ...setCookieOptions, httpOnly: true });
        SessionEmitters.toSessionAdmins(session.toString(), Events.PLAYERS_UPDATE, {});
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

export const fetchPlayer = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const playerId = req.user?.id;
        if (!playerId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Player ID is required",
            });
            return;
        }

        const player = await playerService.getPlayerById(playerId.toString());
        if (!player) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Player not found",
            });
            return;
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: player,
        });
    } catch (error) {
        console.error("Error fetching player:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
};


export const getPlayersCards = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const sessionId = req.user?.sessionId;
        const currentUserId = req.user?.id;

        if (!sessionId || !currentUserId) {
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
                guessedPersonId: guess.guessedPersonId || null, // This will be null until the user guesses
                responses: aspectResponseMap,
            });
        }

        // Shuffle the result array
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
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
        const sessionId = req.user?.sessionId;
        const currentUserId = req.user?.id;

        if (!sessionId || !currentUserId) {
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
        for (let i = filteredPlayers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filteredPlayers[i], filteredPlayers[j]] = [filteredPlayers[j], filteredPlayers[i]];
        }

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
        const sessionId = req.user?.sessionId;

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
            attempts: (guess.attempts || 0) + 1, // Increment attempts
            guessedPersonId: guessedPersonId
        });

        if (isCorrect) {
            // Update player score if the guess is correct
            const attempts = guess.attempts ?? 0;
            const player = await playerService.updatePlayerScore(guess.user.toString(), 100 - attempts * 10);
            if (!player) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Player not found",
                });
                return;
            }
            SessionEmitters.toUser(guess.personId?.toString() ?? "", Events.PLAYER_STAT_UPDATE, {});

        }
        SessionEmitters.toSessionAdmins(sessionId?.toString() ?? "", Events.PLAYERS_UPDATE, {});
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

export const getUserGuesses = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const currentUserId = req.user?.id;

        if (!currentUserId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }

        // Fetch all guesses made by the user
        const guesses = await playerService.getGuessesByUserId(currentUserId);

        const result = guesses.map((guess: any) => {
            if (!guess.guessedPersonId) {
                return {
                    guessId: guess._id,
                    status: "no guess",
                    guessedPersonId: null, // No guess made yet
                };
            }
            const isCorrect = guess.personId.toString() === guess.guessedPersonId.toString();
            return {
                guessId: guess._id,
                status: isCorrect ? "correct" : "wrong",
                guessedPersonId: isCorrect ? guess.guessedPersonId : null,
            };
        });

        res.status(StatusCodes.OK).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error fetching user guesses:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
};

export const updatePlayer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { playerId, name, score } = req.body;

        const updateData: Partial<{ name: string; score: number }> = {};
        if (name !== undefined) updateData.name = name;
        if (score !== undefined) updateData.score = score;

        if (!playerId) {
            return next(new AppError("Player ID is required.", StatusCodes.BAD_REQUEST));
        }

        const updatedPlayer = await playerService.updatePlayerById(playerId, updateData);

        if (!updatedPlayer) {
            return next(new AppError("Player not found or update failed.", StatusCodes.NOT_FOUND));
        }

        res.status(StatusCodes.OK).json({
            message: "Player updated successfully.",
            data: updatedPlayer,
        });
    } catch (error) {
        console.error("Error updating player:", error);
        next(new AppError("Failed to update player.", StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


export const getPlayerWithResponses = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { playerId } = req.params;
        if (!playerId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Player ID is required",
            });
            return;
        }

        // Get player data
        const player = await playerService.getPlayerById(playerId.toString());
        if (!player) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Player not found",
            });
            return;
        }

        // Get responses by player id
        const responses = await questionService.getResponsesByPlayerId(playerId);

        // Map responses with question keyAspect and text
        const mappedResponses = [];
        for (const response of responses) {
            const question = await questionService.getQuestionById(response.question.toString());
            if (question) {
                mappedResponses.push({
                    questionId: question._id,
                    keyAspect: question.keyAspect,
                    questionText: question.questionText,
                    response: response.response,
                });
            }
        }

        let profilePicture = "";
        if (player.profilePhoto) {
            const file = await fileService.getFileById(player.profilePhoto.toString());
            profilePicture = file?.location || "";
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: {
                player: {
                    id: player._id,
                    name: player.name,
                    profilePhoto: profilePicture,
                    score: player.score,
                },
                responses: mappedResponses,
            },
        });
    } catch (error) {
        console.error("Error fetching player with responses:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
};

export const getPlayerStats = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const playerId = req.user?.id;
        if (!playerId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Player ID is required",
            });
            return;
        }

        // Get player data
        const player = await playerService.getPlayerById(playerId.toString());
        if (!player) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Player not found",
            });
            return;
        }

        // Total score
        const totalScore = player.score ?? 0;

        // People you know
        const guessesByUser = await playerService.getGuessesByUserId(player._id);
        const correctGuessesByUser = guessesByUser.filter(
            (guess: any) =>
                guess.guessedPersonId &&
                guess.personId.toString() === guess.guessedPersonId.toString()
        );
        const peopleIKnow = correctGuessesByUser.length;

        // People who know you
        const guessesByPerson = await playerService.getGuessesByPersonId(player._id);
        const correctGuessesByPerson = guessesByPerson.filter(
            (guess: any) =>
                guess.guessedPersonId &&
                guess.personId.toString() === guess.guessedPersonId.toString()
        );
        const peopleWhoKnowMe = correctGuessesByPerson.length;

        res.status(StatusCodes.OK).json({
            success: true,
            data: {
                totalScore,
                peopleIKnow,
                peopleWhoKnowMe,
            },
        });
    } catch (error) {
        console.error("Error fetching player stats:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
};

