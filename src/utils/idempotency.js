import { redisPublisher } from "../config/redis.js";

export async function isUniqueShipmentOrder(orderId, ttlSeconds = 86400) {
  const key = `${process.env.REDIS_ORDER_IDEMPOTENCY_KEY}:${orderId}`;
  const result = await redisPublisher.set(key, "1", "NX", "EX", ttlSeconds);

  return result === "OK";
}
