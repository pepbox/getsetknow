import { getSocketIO } from "./index";
import { roomManager } from "./roomManager";
import { socketManager } from "./socketManager";

export class SessionEmitters {
  private static getIO() {
    return getSocketIO(); // Get it when needed
  }

  static toSession(sessionId: string, event: string, data: any) {
    const io = this.getIO();
    const sockets = roomManager.getSessionSockets(sessionId);
    sockets.forEach((socketId) => {
      io.to(socketId).emit(event, data);
    });
  }

  static toSessionPlayers(sessionId: string, event: string, data: any) {
    const io = this.getIO();

    const sockets = roomManager.getSessionPlayers(sessionId);
    sockets.forEach((socketId) => {
      io.to(socketId).emit(event, data);
    });
  }

  static toSessionAdmins(sessionId: string, event: string, data: any) {
    const io = this.getIO();

    const sockets = roomManager.getSessionAdmins(sessionId);
    sockets.forEach((socketId) => {
      io.to(socketId).emit(event, data);
    });
  }

  // Emit to specific team
  static toTeam(sessionId: string, teamId: string, event: string, data: any) {
    const io = this.getIO();

    const sockets = roomManager.getTeamSockets(sessionId, teamId);
    sockets.forEach((socketId) => {
      io.to(socketId).emit(event, data);
    });
  }

  static toUser(userId: string, event: string, data: any) {
    const io = this.getIO();

    const sockets = socketManager.getUserSockets(userId);
    sockets.forEach((socketId) => {
      io.to(socketId).emit(event, data);
    });
  }
}
