import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

/**
 * Prefix for all Redis keys belonging to GetSetKnow.
 * Change this value if multiple games share the same Redis instance.
 */
export const GAME_PREFIX = process.env.REDIS_KEY_PREFIX || "get-set-know";

const redisOptions: import("ioredis").RedisOptions = {
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 5) {
      console.error("❌ Redis max connection attempts reached");
      return null;
    }
    return Math.min(times * 200, 2000);
  },
};


// General Redis client - presence tracking + caching
export const redis = new Redis(REDIS_URL, redisOptions);

// Dedicated publish client for Socket.IO adapter
export const pubClient = new Redis(REDIS_URL, redisOptions);

// Dedicated subscribe client for Socket.IO adapter
export const subClient = new Redis(REDIS_URL, redisOptions);


redis.on("error", (err) => console.error("Redis (main) error:", err));
pubClient.on("error", (err) => console.error("Redis (pubClient) error:", err));
subClient.on("error", (err) => console.error("Redis (subClient) error:", err));

/**
 * Connect all three Redis clients before the server starts accepting connections.
 */
export async function connectRedis(): Promise<void> {
  await Promise.all([
    redis.connect().then(() => console.log("✅ Redis connected (main)")),
    pubClient.connect().then(() => console.log("✅ Redis connected (pubClient)")),
    subClient.connect().then(() => console.log("✅ Redis connected (subClient)")),
  ]);
}
