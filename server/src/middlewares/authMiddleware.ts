import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Player } from '../modules/players/models/player.model';

dotenv.config();

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    return; // Ensure function exits here
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: mongoose.Types.ObjectId; role: 'USER' | 'ADMIN'; companyId: string; sessionId?: mongoose.Types.ObjectId };
    req.user = decoded;

    if (decoded.role === 'USER') {
      const playerExists = await Player.exists({ _id: decoded.id });
      if (!playerExists) {
        res.clearCookie("accessToken");
        res.status(401).json({ success: false, message: 'Unauthorized: Player has been removed from session' });
        return;
      }
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    return;
  }
};


export const authorizeRoles = (...roles: ('USER' | 'ADMIN')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
      return;
    }
    next();
  };
};



