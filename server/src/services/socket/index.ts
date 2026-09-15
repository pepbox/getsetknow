import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "../../config/redis";
import { socketManager } from "./socketManager";
import { roomManager } from "./roomManager";
import { socketAuthMiddleware } from "../../middlewares/socketAuthMiddleware";

let ioInstance: Server | null = null;

export function initializeSocket(server: HTTPServer): Server {
  if (ioInstance) return ioInstance;

  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  // Attach Redis Adapter for multi-instance broadcast
  io.adapter(createAdapter(pubClient, subClient));

  io.use(socketAuthMiddleware);

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    const user = (socket as any).user;
    if (user) {
      socketManager.addSocket(socket.id, user);
      roomManager.addSocketToSession(socket.id, user);

      // Join native Socket.IO rooms for cross-instance Redis broadcast
      if (user.sessionId) {
        socket.join(`session:${user.sessionId}`);
        if (user.role === "ADMIN") {
          socket.join(`session:${user.sessionId}:admins`);
        } else if (user.role === "USER") {
          socket.join(`session:${user.sessionId}:players`);
        }
      }

      // Join individual user room
      if (user.id) {
        socket.join(`user:${user.id}`);
      }
    }

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      socketManager.removeSocket(socket.id);
      roomManager.removeSocketFromSession(socket.id);
    });

  });

  ioInstance = io;
  return io;
}

export function getSocketIO(): Server {
  if (!ioInstance) {
    throw new Error("Socket.IO not initialized yet");
  }
  return ioInstance;
}

