import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

redis.on("connect", () => console.log("Redis connection succeed"));
redis.on("error", (err) => console.log("Redis Client Error: ", err));

export const initRedis = async () => {
  try {
    await redis.connect();
  } catch (err) {
    console.error("falied to connect to redis.");
  }
};
