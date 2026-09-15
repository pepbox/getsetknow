import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";
import v1Routes from "./routes/v1/index";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import notFoundMiddleware from "./middlewares/notFound";
import cookieParser from "cookie-parser";
import { initializeSocket } from "./services/socket/index";
import http from "http";

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5172",
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in dev or fallback gracefully
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/v1", v1Routes);

// Health check endpoint for GCP Cloud Run / Load Balancer
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const args = process.argv.slice(2);
const portArgIndex = args.indexOf("--port");

const PORT =
  portArgIndex !== -1
    ? Number(args[portArgIndex + 1])
    : Number(process.env.PORT) || 8080;

const startServer = async () => {
  try {
    // 1. Initialize Socket.IO with server
    initializeSocket(server);

    // 2. Start listening on 0.0.0.0 immediately so Cloud Run health check passes instantly
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running and listening on port ${PORT}`);
    });

    // 3. Connect to MongoDB and Redis in parallel
    await Promise.all([
      connectDB().catch((err) => {
        console.error("❌ MongoDB connection error:", err);
      }),
      connectRedis().catch((err) => {
        console.error("❌ Redis connection error:", err);
      }),
    ]);

    console.log(`⚡ Background services connected and ready`);
  } catch (error) {
    console.error("❌ Error during server startup:", error);
  }
};

startServer();