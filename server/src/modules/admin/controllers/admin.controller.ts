import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import AppError from '../../../utils/appError';
import SessionService from '../../session/services/session.service';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwtUtils';
import AdminServices from '../services/admin.service';
import { setCookieOptions } from '../../../utils/cookieOptions';
import PlayerService from '../../players/services/player.service';
import { Player } from '../../players/models/player.model';
import QuestionService from '../../questions/services/question.service';
import { Question } from '../../questions/models/question.model';
import { SessionStatus } from '../../session/types/enums';
import { SessionEmitters } from '../../../services/socket/sessionEmitters';
import { Events } from '../../../services/socket/enums/Events';
import FileService from '../../files/services/fileService';
import TeamService from '../../teams/services/team.service';

const adminService = new AdminServices();
const sessionService = new SessionService();
const playerService = new PlayerService(Player); // Assuming you have a player service
const questionService = new QuestionService(Question); // Assuming you have a question service
const fileService = new FileService();
const teamService = new TeamService();


export const createAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { password, name } = req.body;
        const sessionId = req.user?.sessionId;
        if (!sessionId || !password) {
            return next(new AppError("Session ID and password are required.", 400));
        }
        const session = await sessionService.fetchSessionById(sessionId);
        if (!session) {
            return next(new AppError("Session not found.", 404));
        }

        const admin = await adminService.createAdmin({
            sessionId,
            password,
            name,
        });

        if (!admin) {
            return next(new AppError("Failed to create admin.", 500));
        }

        const accessToken = generateAccessToken({
            id: admin._id.toString(),
            role: "ADMIN",
            sessionId: admin.sessionId.toString(),
        });

        res.cookie("accessToken", accessToken, setCookieOptions);

        res.status(201).json({
            message: "Admin created successfully.",
            data: {
                admin,
            },
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        next(new AppError("Failed to create admin.", 500));
    }
};

export const loginAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { sessionId, password } = req.body;
        if (!sessionId || !password) {
            return next(new AppError("Session ID and password are required.", 400));
        }

        const admin = await adminService.loginAdmin({
            sessionId,
            password,
        });
        const session = await sessionService.fetchSessionById(sessionId);
        if (!session) {
            return next(new AppError("Session not found.", 404));
        }
        if (session.status === SessionStatus.ENDED) {
            return next(new AppError("Session has ended. Admin cannot log in.", 403));
        }
        if (!admin) {
            return next(new AppError("Invalid session ID or password.", 401));
        }

        const accessToken = generateAccessToken({
            id: admin._id.toString(),
            role: "ADMIN",
            sessionId: admin.sessionId.toString(),
        });
        const refreshToken = generateRefreshToken(admin._id.toString());

        res.cookie("accessToken", accessToken, setCookieOptions);
        res.cookie("refreshToken", refreshToken, { ...setCookieOptions, httpOnly: true });


        res.status(200).json({
            message: "Admin logged in successfully.",
            data: {
                admin,
            },
            success: true,
        });
    } catch (error) {
        console.error("Error logging in admin:", error);
        next(new AppError("Failed to log in admin.", 500));
    }
};

export const fetchAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const sessionId = req.user?.sessionId;
    if (!sessionId) {
        return next(new AppError("Session ID is required or does not match.", 400));
    }

    try {
        const adminId = req.user.id;
        if (!adminId) {
            return next(new AppError("Admin ID is required.", 400));
        }

        const admin = await adminService.fetchAdminById(adminId);
        if (!admin) {
            return next(new AppError("Admin not found.", 404));
        }

        res.status(200).json({
            success: true,
            data: admin,
        });
    } catch (error: any) { }
};

export const logoutAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        res.status(200).json({
            success: true,
            message: "Admin logged out successfully.",
        });
    } catch (error) {
        console.error("Error logging out admin:", error);
        next(new AppError("Failed to log out admin.", 500));
    }
};

export const fetchAdminDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.user?.sessionId;
        const adminId = req.user?.id;

        if (!sessionId || !adminId) {
            return next(new AppError("Session ID and Admin ID are required.", 400));
        }

        // Fetch admin and session
        const admin = await adminService.fetchAdminById(adminId);
        const session = await sessionService.fetchSessionById(sessionId);

        // Calculate total question count for session
        const sessionQuestions = session.questions && session.questions.length > 0
            ? session.questions
            : await questionService.getAllQuestions();
        const totalQuestionCount = sessionQuestions.length;

        // Fetch all players in the session
        const players = await playerService.getPlayersBySession(sessionId);
        const playerDataPromises = players.map(async (player) => {
            // Questions answered
            const responses = await questionService.getResponsesByPlayerId(player._id.toString());
            const questionsAnswered = `${responses.length}/${totalQuestionCount}`;

            // People you know
            const guessesByUser = await playerService.getGuessesByUserId(player._id);
            const correctGuessesByUser = guessesByUser.filter(
                (guess) =>
                    guess.guessedPersonId &&
                    guess.personId.toString() === guess.guessedPersonId.toString()
            );
            const peopleYouKnow = `${correctGuessesByUser.length}`;
            // People who know you
            const guessesByPerson = await playerService.getGuessesByPersonId(player._id);
            const correctGuessesByPerson = guessesByPerson.filter(
                (guess) =>
                    guess.guessedPersonId &&
                    guess.personId.toString() === guess.guessedPersonId.toString()
            );
            const peopleWhoKnowYou = `${correctGuessesByPerson.length}`;
            // Status from session 
            const currentStatus = session.status || "Pending";

            // Total score
            const totalScore = player.score || 0;
            const team = await teamService.fetchTeamById(player?.team?.toString() || "");

            return {
                id: player._id.toString(),
                name: player.name,
                questionsAnswered,
                currentStatus,
                rank: 0,
                peopleYouKnow,
                peopleWhoKnowYou,
                totalScore,
                team: team.teamNumber,
            };
        });

        let playersData = await Promise.all(playerDataPromises);

        playersData = playersData.sort((a, b) => b.totalScore - a.totalScore);

        playersData = playersData.map((player, idx) => ({
            ...player,
            rank: idx + 1,
        }));

        const data = {
            headerData: {
                adminName: admin.name,
                gameStatus: session.status,
            },
            players: playersData,
        };

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        next(new AppError("Failed to fetch admin dashboard data.", 500));
    }
};

export const fetchLeaderboardData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.user?.sessionId;
        const adminId = req.user?.id;

        if (!sessionId || !adminId) {
            return next(new AppError("Session ID and Admin ID are required.", 400));
        }

        // Fetch all players in the session sorted by score
        const players = await playerService.getPlayersBySession(sessionId);

        // Sort players by score and get top 12
        const sortedPlayers = players
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 12); // Get only top 12 players

        const profilePhotos = await Promise.all(
            sortedPlayers.map(async (player) => {
                if (player.profilePhoto) {
                    const profilePhoto = await fileService.getFileById(player.profilePhoto.toString());
                    return profilePhoto?.location || "";
                }
                return "";
            })
        );

        const playerRankings = sortedPlayers.map((player, index) => ({
            id: player._id.toString(),
            name: player.name,
            profilePhoto: profilePhotos[index],
            score: player.score || 0,
            rank: index + 1,
        }));

        // Fetch all guesses with selfies for this session
        const allGuesses = await playerService.getGuessesWithSelfiesForSession(sessionId);

        const selfies = await Promise.all(
            allGuesses.map(async (guess: any) => {
                // Get guesser and guessed person details
                const guesser = await playerService.getPlayerById(guess.user.toString());
                const guessedPerson = await playerService.getPlayerById(guess.personId.toString());
                let selfiePicture = "";
                if (guess.selfie) {
                    const file = await fileService.getFileById(guess.selfie.toString());
                    selfiePicture = file?.location || "";
                }
                return {
                    id: guess._id.toString(),
                    guesserName: guesser?.name || "Unknown",
                    guessedPersonName: guessedPerson?.name || "Unknown",
                    selfieId: selfiePicture,
                    createdAt: guess.createdAt,
                    updatedAt: guess.updatedAt, // Include updatedAt for proper sorting
                };
            })
        );

        // Filter out selfies without images, sort by latest first, and get top 12
        const filteredAndSortedSelfies = selfies
            .filter((selfie: any) => selfie.selfieId) // Only include selfies that exist
            .sort((a: any, b: any) => {
                // Use updatedAt for sorting since that's when the selfie was actually uploaded
                const dateA = new Date(a.updatedAt || a.createdAt);
                const dateB = new Date(b.updatedAt || b.createdAt);
                return dateB.getTime() - dateA.getTime(); // Sort by latest first
            })
            .slice(0, 12); // Get only top 12 latest selfies

        const data = {
            playerRankings,
            selfies: filteredAndSortedSelfies,
        };

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        next(new AppError("Failed to fetch leaderboard data.", 500));
    }
};

export const checkPlayersReadiness = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.user?.sessionId;
        const adminId = req.user?.id;

        if (!sessionId || !adminId) {
            return next(new AppError("Session ID and Admin ID are required.", 400));
        }

        // Fetch all players in the session
        const players = await playerService.getPlayersBySession(sessionId);
        
        // Get total number of questions for this session
        const session = await sessionService.fetchSessionById(sessionId);
        const sessionQuestions = session.questions && session.questions.length > 0
            ? session.questions
            : await questionService.getAllQuestions();
        const totalQuestionCount = sessionQuestions.length;

        const pendingPlayers = [];
        
        for (const player of players) {
            // Get responses by player id
            const responses = await questionService.getResponsesByPlayerId(player._id.toString());
            const answeredCount = responses.length;
            
            // If player hasn't answered all questions, add to pending list
            if (answeredCount < totalQuestionCount) {
                const team = await teamService.fetchTeamById(player?.team?.toString() || "");
                pendingPlayers.push({
                    id: player._id.toString(),
                    name: player.name,
                    team: team?.teamNumber || 0,
                    questionsAnswered: `${answeredCount}/${totalQuestionCount}`
                });
            }
        }

        const allReady = pendingPlayers.length === 0;

        res.status(200).json({
            success: true,
            data: {
                allReady,
                pendingPlayers,
                totalPlayers: players.length
            }
        });
    } catch (error) {
        console.error("Error checking players readiness:", error);
        next(new AppError("Failed to check players readiness.", 500));
    }
};

export const getSessionQuestions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.user?.sessionId;
        if (!sessionId) {
            return next(new AppError("Session ID is required.", 400));
        }

        const session = await sessionService.fetchSessionById(sessionId);
        const allQuestions = await Question.find({
            $or: [
                { isDefault: true },
                { session: sessionId }
            ]
        });

        const activeQuestionIds = session.questions && session.questions.length > 0
            ? session.questions.map((q: any) => q.toString())
            : null; // null means all questions are active by default

        const data = allQuestions.map((question: any) => {
            const isSelected = activeQuestionIds === null || activeQuestionIds.includes(question._id.toString());
            return {
                id: question._id.toString(),
                questionText: question.questionText,
                keyAspect: question.keyAspect,
                isDefault: question.isDefault === true,
                isSelected,
            };
        });

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error fetching session questions:", error);
        next(new AppError("Failed to fetch session questions.", 500));
    }
};

export const selectSessionQuestions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.user?.sessionId;
        const { questionIds } = req.body;

        if (!sessionId) {
            return next(new AppError("Session ID is required.", 400));
        }

        if (!Array.isArray(questionIds)) {
            return next(new AppError("questionIds must be an array of strings.", 400));
        }

        const session = await sessionService.fetchSessionById(sessionId);
        if (session.status !== SessionStatus.PENDING) {
            return next(new AppError("Cannot modify questions after the game has started.", 403));
        }

        const updatedSession = await sessionService.updateSessionById(sessionId, {
            questions: questionIds,
        });

        // Notify session players of potential question change
        SessionEmitters.toSession(sessionId.toString(), Events.SESSION_UPDATE, {});

        res.status(200).json({
            success: true,
            message: "Questions updated successfully.",
            data: updatedSession,
        });
    } catch (error) {
        console.error("Error selecting session questions:", error);
        next(new AppError("Failed to update session questions.", 500));
    }
};

export const addCustomQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.user?.sessionId;
        const { questionText, keyAspect } = req.body;

        if (!sessionId) {
            return next(new AppError("Session ID is required.", 400));
        }

        if (!questionText || !keyAspect) {
            return next(new AppError("Question text and key aspect are required.", 400));
        }

        const session = await sessionService.fetchSessionById(sessionId);
        if (session.status !== SessionStatus.PENDING) {
            return next(new AppError("Cannot add custom questions after the game has started.", 403));
        }

        // Create the new question
        const newQuestion = await questionService.createQuestion({
            questionText,
            keyAspect,
            session: sessionId,
        });

        // Add to current session's active questions
        let activeQuestionIds = session.questions && session.questions.length > 0
            ? session.questions.map((q: any) => q.toString())
            : [];

        if (activeQuestionIds.length === 0) {
            // If currently empty, it means all existing questions were active.
            // Populating active questions with existing ones + new one.
            const sessionQuestions = await Question.find({
                $or: [
                    { isDefault: true },
                    { session: sessionId }
                ]
            });
            activeQuestionIds = sessionQuestions.map((q: any) => q._id.toString());
        } else {
            // Otherwise, append the new question ID
            activeQuestionIds.push((newQuestion as any)._id.toString());
        }

        await sessionService.updateSessionById(sessionId, {
            questions: activeQuestionIds,
        });

        // Notify session players of potential question change
        SessionEmitters.toSession(sessionId.toString(), Events.SESSION_UPDATE, {});

        res.status(201).json({
            success: true,
            message: "Custom question created and selected successfully.",
            data: newQuestion,
        });
    } catch (error) {
        console.error("Error adding custom question:", error);
        next(new AppError("Failed to add custom question.", 500));
    }
};

export const deleteCustomQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.user?.sessionId;
        const { questionId } = req.params;

        if (!sessionId) {
            return next(new AppError("Session ID is required.", 400));
        }

        if (!questionId) {
            return next(new AppError("Question ID is required.", 400));
        }

        const session = await sessionService.fetchSessionById(sessionId);

        // Cannot delete question after the game has started.
        if (session.status !== SessionStatus.PENDING) {
            return next(new AppError("Cannot delete question after the game has started.", 403));
        }

        // Fetch question first to verify if it is default
        const question = await questionService.getQuestionById(questionId);
        if (!question) {
            return next(new AppError("Question not found.", 404));
        }

        if (question.isDefault) {
            return next(new AppError("Default questions cannot be deleted.", 403));
        }

        if (question.session && question.session.toString() !== sessionId.toString()) {
            return next(new AppError("You do not have permission to delete this question.", 403));
        }

        // Delete the question
        const deletedQuestion = await questionService.deleteQuestion(questionId);

        if (!deletedQuestion) {
            return next(new AppError("Question not found.", 404));
        }

        // Remove from session if present
        let activeQuestionIds = session.questions && session.questions.length > 0
            ? session.questions.map((q: any) => q.toString())
            : [];

        if (activeQuestionIds.length > 0) {
            activeQuestionIds = activeQuestionIds.filter((id: string) => id !== questionId);
            await sessionService.updateSessionById(sessionId, {
                questions: activeQuestionIds,
            });
        }

        // Notify session players of potential question change
        SessionEmitters.toSession(sessionId.toString(), Events.SESSION_UPDATE, {});

        res.status(200).json({
            success: true,
            message: "Custom question deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting custom question:", error);
        next(new AppError("Failed to delete custom question.", 500));
    }
};

export const getSessionTeams = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.user?.sessionId;
        if (!sessionId) {
            return next(new AppError("Session ID is required.", 400));
        }
        const teams = await teamService.getAllTeamsBySessionId(sessionId.toString());
        // Return player count for each team
        const teamsWithPlayerCounts = await Promise.all(
            teams.map(async (team: any) => {
                const playerCount = await Player.countDocuments({ team: team._id });
                return {
                    id: team._id.toString(),
                    teamNumber: team.teamNumber,
                    playerCount,
                };
            })
        );
        res.status(200).json({
            success: true,
            data: teamsWithPlayerCounts,
        });
    } catch (error) {
        console.error("Error fetching session teams:", error);
        next(new AppError("Failed to fetch session teams.", 500));
    }
};

export const createBulkTeams = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.user?.sessionId;
        const { count } = req.body;
        if (!sessionId) {
            return next(new AppError("Session ID is required.", 400));
        }
        if (!count || typeof count !== "number" || count < 1) {
            return next(new AppError("A valid count of teams (minimum 1) is required.", 400));
        }

        const session = await sessionService.fetchSessionById(sessionId.toString());
        if (session.status !== SessionStatus.PENDING) {
            return next(new AppError("Cannot modify teams after the game has started.", 403));
        }

        // 1. Fetch current teams for session
        const existingTeams = await teamService.getAllTeamsBySessionId(sessionId.toString());

        // 2. Identify and keep teams that have players; delete empty ones
        const teamsWithPlayers = [];
        for (const team of existingTeams) {
            const pCount = await Player.countDocuments({ team: team._id });
            if (pCount > 0) {
                teamsWithPlayers.push(team);
            } else {
                await teamService.deleteTeamById(team._id);
            }
        }

        // 3. Create teams up to count
        const keepCount = teamsWithPlayers.length;
        const toCreate = count - keepCount;

        if (toCreate > 0) {
            await teamService.createMultipleTeams(toCreate, {
                session: new Types.ObjectId(sessionId.toString()),
            });
        }

        // 4. Re-index remaining teams sequentially to ensure Team 1, Team 2, ... Team N
        const finalTeams = await teamService.getAllTeamsBySessionId(sessionId.toString());
        for (let i = 0; i < finalTeams.length; i++) {
            await teamService.updateTeamById(finalTeams[i]._id, { teamNumber: i + 1 });
        }

        // 5. Notify player views of team updates
        SessionEmitters.toSession(sessionId.toString(), Events.SESSION_UPDATE, {});

        res.status(200).json({
            success: true,
            message: `Teams updated successfully. Session now has ${finalTeams.length} teams.`,
        });
    } catch (error) {
        console.error("Error creating bulk teams:", error);
        next(new AppError("Failed to update teams.", 500));
    }
};

export const addSingleTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.user?.sessionId;
        if (!sessionId) {
            return next(new AppError("Session ID is required.", 400));
        }

        const session = await sessionService.fetchSessionById(sessionId.toString());
        if (session.status !== SessionStatus.PENDING) {
            return next(new AppError("Cannot add teams after the game has started.", 403));
        }

        const existingTeams = await teamService.getAllTeamsBySessionId(sessionId.toString());
        const nextTeamNumber = existingTeams.length > 0 ? Math.max(...existingTeams.map(t => t.teamNumber)) + 1 : 1;

        const newTeam = await teamService.createTeam({
            teamNumber: nextTeamNumber,
            session: sessionId,
            teamScore: 0
        });

        // Notify player views
        SessionEmitters.toSession(sessionId.toString(), Events.SESSION_UPDATE, {});

        res.status(201).json({
            success: true,
            message: "Team added successfully.",
            data: newTeam,
        });
    } catch (error) {
        console.error("Error adding single team:", error);
        next(new AppError("Failed to add team.", 500));
    }
};

export const deleteSingleTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.user?.sessionId;
        const { teamId } = req.params;

        if (!sessionId) {
            return next(new AppError("Session ID is required.", 400));
        }
        if (!teamId) {
            return next(new AppError("Team ID is required.", 400));
        }

        const session = await sessionService.fetchSessionById(sessionId.toString());
        if (session.status !== SessionStatus.PENDING) {
            return next(new AppError("Cannot delete teams after the game has started.", 403));
        }

        // Check if team has players
        const playersCount = await Player.countDocuments({ team: teamId });
        if (playersCount > 0) {
            return next(new AppError("Cannot delete team because players are currently assigned to it.", 400));
        }

        await teamService.deleteTeamById(teamId);

        // Re-index remaining teams
        const remainingTeams = await teamService.getAllTeamsBySessionId(sessionId.toString());
        for (let i = 0; i < remainingTeams.length; i++) {
            await teamService.updateTeamById(remainingTeams[i]._id, { teamNumber: i + 1 });
        }

        // Notify player views
        SessionEmitters.toSession(sessionId.toString(), Events.SESSION_UPDATE, {});

        res.status(200).json({
            success: true,
            message: "Team deleted successfully and remaining teams re-indexed.",
        });
    } catch (error) {
        console.error("Error deleting team:", error);
        next(new AppError("Failed to delete team.", 500));
    }
};