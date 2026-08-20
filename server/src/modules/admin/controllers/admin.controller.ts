import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import AppError from '../../../utils/appError';
import SessionService from '../../session/services/session.service';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwtUtils';
import AdminServices from '../services/admin.service';
import { setCookieOptions } from '../../../utils/cookieOptions';
import PlayerService from '../../players/services/player.service';
import { Player } from '../../players/models/player.model';
import { Guess } from '../../players/models/guess.model';
import QuestionService from '../../questions/services/question.service';
import { Question } from '../../questions/models/question.model';
import { QuestionResponse } from '../../questions/models/question.response.model';
import { SessionStatus } from '../../session/types/enums';
import { SessionEmitters } from '../../../services/socket/sessionEmitters';
import { Events } from '../../../services/socket/enums/Events';
import FileService from '../../files/services/fileService';
import TeamService from '../../teams/services/team.service';
import { roomManager } from '../../../services/socket/roomManager';

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
            : await Question.find({ isDefault: true });
        const totalQuestionCount = sessionQuestions.length;

        // Fetch all players in the session
        const players = await playerService.getPlayersBySession(sessionId);
        const playerIds = players.map(p => p._id);

        // Bulk Fetch responses, guesses, and teams to solve N+1 queries
        const [allResponses, allGuesses, teams] = await Promise.all([
            QuestionResponse.find({ player: { $in: playerIds } }).lean(),
            Guess.find({ session: sessionId }).lean(),
            teamService.getAllTeamsBySessionId(sessionId.toString())
        ]);

        // Group responses by player
        const responsesByPlayer = new Map<string, any[]>();
        for (const resp of allResponses) {
            const pId = resp.player.toString();
            if (!responsesByPlayer.has(pId)) {
                responsesByPlayer.set(pId, []);
            }
            responsesByPlayer.get(pId)!.push(resp);
        }

        // Group guesses by user (guesser) and personId (target)
        const guessesByUserMap = new Map<string, any[]>();
        const guessesByPersonMap = new Map<string, any[]>();
        for (const guess of allGuesses) {
            const userId = guess.user.toString();
            const personId = guess.personId.toString();

            if (!guessesByUserMap.has(userId)) {
                guessesByUserMap.set(userId, []);
            }
            guessesByUserMap.get(userId)!.push(guess);

            if (!guessesByPersonMap.has(personId)) {
                guessesByPersonMap.set(personId, []);
            }
            guessesByPersonMap.get(personId)!.push(guess);
        }

        // Map teamId to teamNumber
        const teamMap = new Map(teams.map(t => [t._id.toString(), t.teamNumber]));

        const playersData = players.map((player) => {
            const playerIdStr = player._id.toString();

            // Questions answered
            const responses = responsesByPlayer.get(playerIdStr) || [];
            const questionsAnswered = `${responses.length}/${totalQuestionCount}`;

            // People you know
            const guessesByUser = guessesByUserMap.get(playerIdStr) || [];
            const correctGuessesByUser = guessesByUser.filter(
                (guess) =>
                    guess.guessedPersonId &&
                    guess.personId.toString() === guess.guessedPersonId.toString()
            );
            const peopleYouKnow = `${correctGuessesByUser.length}`;

            // Calculate wrong guesses count
            let wrongGuesses = 0;
            guessesByUser.forEach((guess: any) => {
                const isCorrect =
                    guess.guessedPersonId &&
                    guess.personId.toString() === guess.guessedPersonId.toString();
                const attempts = guess.attempts || 0;
                wrongGuesses += isCorrect ? Math.max(0, attempts - 1) : attempts;
            });

            // People who know you
            const guessesByPerson = guessesByPersonMap.get(playerIdStr) || [];
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
            const teamNumber = player.team ? teamMap.get(player.team.toString()) : null;

            return {
                id: playerIdStr,
                name: player.name,
                questionsAnswered,
                currentStatus,
                rank: 0,
                peopleYouKnow,
                peopleWhoKnowYou,
                wrongGuesses,
                totalScore,
                team: teamNumber || 0,
            };
        });

        // Group players by team (excluding those with no team if we only rank within valid teams, or grouping them together)
        const playersByTeam = new Map<number, any[]>();
        for (const p of playersData) {
            const teamNum = p.team || 0;
            if (!playersByTeam.has(teamNum)) {
                playersByTeam.set(teamNum, []);
            }
            playersByTeam.get(teamNum)!.push(p);
        }

        // Sort each team and assign cluster rank using score (desc) and wrongGuesses (asc) as tie-breaker
        for (const [teamNum, teamPlayers] of playersByTeam.entries()) {
            teamPlayers.sort((a, b) => {
                if (b.totalScore !== a.totalScore) {
                    return b.totalScore - a.totalScore;
                }
                return a.wrongGuesses - b.wrongGuesses;
            });
            teamPlayers.forEach((p, idx) => {
                p.rank = idx + 1; // Assign rank within their team/cluster
            });
        }

        // Sort the entire playersData list by score desc, then wrongGuesses asc for presentation
        const sortedPlayersData = playersData.sort((a, b) => {
            if (b.totalScore !== a.totalScore) {
                return b.totalScore - a.totalScore;
            }
            return a.wrongGuesses - b.wrongGuesses;
        });

        const data = {
            headerData: {
                adminName: admin.name,
                gameStatus: session.status,
            },
            players: sortedPlayersData,
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

        // Fetch all players in the session
        const players = await playerService.getPlayersBySession(sessionId);
        const playerMap = new Map(players.map((p) => [p._id.toString(), p]));

        // Bulk fetch all teams and guesses for the session to resolve N+1 queries
        const [teams, allGuesses] = await Promise.all([
            teamService.getAllTeamsBySessionId(sessionId.toString()),
            Guess.find({ session: sessionId }).lean()
        ]);

        const teamMap = new Map(teams.map((t) => [t._id.toString(), t.teamNumber]));

        // Group guesses by user (guesser)
        const guessesByUserMap = new Map<string, any[]>();
        for (const guess of allGuesses) {
            const userId = guess.user.toString();
            if (!guessesByUserMap.has(userId)) {
                guessesByUserMap.set(userId, []);
            }
            guessesByUserMap.get(userId)!.push(guess);
        }

        // Compute wrong guesses in-memory for all players in the session
        const playersWithWrongGuesses = players.map((player) => {
            const guessesByUser = guessesByUserMap.get(player._id.toString()) || [];
            let wrongGuesses = 0;
            guessesByUser.forEach((guess: any) => {
                const isCorrect =
                    guess.guessedPersonId &&
                    guess.personId.toString() === guess.guessedPersonId.toString();
                const attempts = guess.attempts || 0;
                wrongGuesses += isCorrect ? Math.max(0, attempts - 1) : attempts;
            });
            return {
                player,
                wrongGuesses,
            };
        });

        // Sort by score descending, then wrongGuesses ascending
        const sortedPlayersWithGuesses = playersWithWrongGuesses
            .sort((a, b) => {
                const scoreA = a.player.score || 0;
                const scoreB = b.player.score || 0;
                if (scoreB !== scoreA) {
                    return scoreB - scoreA;
                }
                return a.wrongGuesses - b.wrongGuesses;
            });

        const playerRankings = await Promise.all(sortedPlayersWithGuesses.map(async (item, index) => {
            const player = item.player;
            let profilePhoto = "";
            if (player.profilePhoto) {
                const file = await fileService.getFileById(player.profilePhoto.toString());
                profilePhoto = file?.location || "";
            }
            const teamNumber = player.team ? teamMap.get(player.team.toString()) : null;
            return {
                id: player._id.toString(),
                name: player.name,
                profilePhoto,
                score: player.score || 0,
                rank: index + 1,
                teamNumber,
                wrongGuesses: item.wrongGuesses,
            };
        }));

        // Filter out guesses with selfies and sort them by latest first, then slice to top 12 BEFORE populating details
        const guessesWithSelfies = allGuesses.filter((g: any) => g.selfie);
        const sortedSelfieGuesses = guessesWithSelfies
            .sort((a: any, b: any) => {
                const dateA = new Date(a.updatedAt || a.createdAt);
                const dateB = new Date(b.updatedAt || b.createdAt);
                return dateB.getTime() - dateA.getTime();
            });

        const selfies = await Promise.all(
            sortedSelfieGuesses.map(async (guess: any) => {
                const guesser = playerMap.get(guess.user.toString());
                const guessedPerson = playerMap.get(guess.personId.toString());
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
                    updatedAt: guess.updatedAt,
                };
            })
        );

        const filteredAndSortedSelfies = selfies.filter((selfie: any) => selfie.selfieId);

        // Count correct guesses where guessedPersonId matches personId
        const correctGuessesCount = await Guess.countDocuments({
            session: sessionId,
            guessedPersonId: { $exists: true, $ne: null },
            $expr: { $eq: ["$personId", "$guessedPersonId"] }
        });
        const connectionsCount = correctGuessesCount;

        const data = {
            playerRankings,
            selfies: filteredAndSortedSelfies,
            connectionsCount,
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
            : await Question.find({ isDefault: true });
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
            : allQuestions.filter((q: any) => q.isDefault).map((q: any) => q._id.toString());

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
            return next(new AppError("A valid count of clusters (minimum 1) is required.", 400));
        }

        const session = await sessionService.fetchSessionById(sessionId.toString());
        if (session.status !== SessionStatus.PENDING) {
            return next(new AppError("Cannot modify clusters after the game has started.", 403));
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
            message: `Clusters updated successfully. Session now has ${finalTeams.length} clusters.`,
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
            return next(new AppError("Cannot add clusters after the game has started.", 403));
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
            message: "Cluster added successfully.",
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
            return next(new AppError("Cannot delete clusters after the game has started.", 403));
        }

        // Check if team has players
        const playersCount = await Player.countDocuments({ team: teamId });
        if (playersCount > 0) {
            return next(new AppError("Cannot delete cluster because players are currently assigned to it.", 400));
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
            message: "Cluster deleted successfully and remaining clusters re-indexed.",
        });
    } catch (error) {
        console.error("Error deleting team:", error);
        next(new AppError("Failed to delete team.", 500));
    }
};

export const removePlayer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { playerId } = req.params;
        const sessionId = req.user?.sessionId;

        if (!playerId || !sessionId) {
            return next(new AppError("Player ID and Session ID are required.", 400));
        }

        // 1. Delete player responses
        await QuestionResponse.deleteMany({ player: playerId });

        // 2. Delete guesses where this player is the user OR the target (personId)
        await Guess.deleteMany({
            $or: [
                { user: playerId },
                { personId: playerId }
            ]
        });

        // 3. Delete the player document itself
        const deletedPlayer = await Player.findByIdAndDelete(playerId);

        if (!deletedPlayer) {
            return next(new AppError("Player not found.", 404));
        }

        // 4. Emit socket event to tell player to log out immediately
        SessionEmitters.toUser(playerId, Events.PLAYER_KICKED, {});

        // 5. Emit socket event to session players and admins that players have updated
        SessionEmitters.toSession(sessionId.toString(), Events.PLAYERS_UPDATE, {});

        res.status(200).json({
            success: true,
            message: "Player removed successfully from the session."
        });
    } catch (error) {
        console.error("Error removing player:", error);
        next(new AppError("Failed to remove player.", 500));
    }
};