import { redisPublisher } from "../config/redis.js";

export async function isUniqueShipmentOrder(orderId, ttlSeconds = 86400) {
  const key = `order-shipment:processed:${orderId}`;
  const result = await redisPublisher.set(key, "1", "NX", "EX", ttlSeconds);

  return result === "OK";
}
