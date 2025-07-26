import { Request, Response, NextFunction } from "express";
import AppError from "../../../utils/appError"; // Adjust path as needed
import { ISession } from "../types/interfaces";
import { SessionStatus } from "../types/enums";
import SessionService from "../services/session.service";
import { SessionEmitters } from "../../../services/socket/sessionEmitters";
import { Events } from "../../../services/socket/enums/Events";


const sessionService = new SessionService(); // Assuming you have a session service
export const updateSession = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.user?.sessionId;
        const updateData: Partial<ISession> = req.body;
        console.log("sessionId", sessionId);
        if (!sessionId) {
            return next(new AppError("Session ID is required.", 400));
        }

        if (updateData.status && !Object.values(SessionStatus).includes(updateData.status)) {
            return next(new AppError("Invalid session status.", 400));
        }

        // Assuming you have imported the service as sessionService
        updateData.updatedAt = new Date();
        const updatedSession = await sessionService.updateSessionById(sessionId, updateData);
        
        if (!updatedSession) {
            return next(new AppError("Session not found.", 404));
        }
        SessionEmitters.toSession(sessionId.toString(), Events.SESSION_UPDATE, {});
        res.status(200).json({
            message: "Session updated successfully.",
            data: {
                session: updatedSession,
            },
            success: true,
        });
    } catch (error) {
        console.error("Error updating session:", error);
        next(new AppError("Failed to update session.", 500));
    }
};

export const getSession = async (
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

        res.status(200).json({
            message: "Session fetched successfully.",
            data: session,

            success: true,
        });
    } catch (error: any) {
        if (error.message === "Session not found") {
            return next(new AppError("Session not found.", 404));
        }
        console.error("Error fetching session:", error);
        next(new AppError("Failed to fetch session.", 500));
    }
};