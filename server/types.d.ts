import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: mongoose.Types.ObjectId;
        role: 'USER' | 'ADMIN';
        sessionId?: mongoose.Types.ObjectId;
      };
    }
  }
}

export { }; 
