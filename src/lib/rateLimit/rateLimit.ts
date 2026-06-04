import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const aiRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 summarize calls per hour per user
  analytics: true,
  prefix: "ratelimit:ai-generate",
});
