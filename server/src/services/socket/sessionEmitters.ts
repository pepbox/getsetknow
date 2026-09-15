import { getSocketIO } from "./index";

export class SessionEmitters {
  private static getIO() {
    return getSocketIO();
  }

  static toSession(sessionId: string, event: string, data: any) {
    this.getIO().to(`session:${sessionId}`).emit(event, data);
  }

  static toSessionPlayers(sessionId: string, event: string, data: any) {
    this.getIO().to(`session:${sessionId}:players`).emit(event, data);
  }

  static toSessionAdmins(sessionId: string, event: string, data: any) {
    this.getIO().to(`session:${sessionId}:admins`).emit(event, data);
  }

  static toTeam(sessionId: string, teamId: string, event: string, data: any) {
    this.getIO().to(`session:${sessionId}:team:${teamId}`).emit(event, data);
  }

  static toUser(userId: string, event: string, data: any) {
    this.getIO().to(`user:${userId}`).emit(event, data);
  }
}

