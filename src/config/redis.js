import Redis from "ioredis";

export const redisPublisher = new Redis({
  host: process.env.REDIS_HOST || "redis_db_dev",
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

redisPublisher.on("connect", () => console.log("Redis connection succeed"));
redisPublisher.on("error", (err) => console.log("Redis Client Error: ", err));
