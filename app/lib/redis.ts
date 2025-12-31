import { createClient, RedisClientType } from "redis";

let redis: RedisClientType | null = null;

export async function getRedis() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL,
    });

    redis.on("error", (err) => {
      console.error("Redis Client Error", err);
    });

    if (!redis.isOpen) {
      await redis.connect();
    }
  }

  return redis;
}
