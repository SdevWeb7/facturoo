import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[SECURITY] Upstash Redis not configured — rate limiting uses in-memory fallback. " +
        "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for production-grade rate limiting."
      );
    }
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const redis = createRedis();

function createLimiter(limit: number, window: Parameters<typeof Ratelimit.slidingWindow>[1]) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
  });
}

export const emailRateLimit = createLimiter(10, "1 h");
export const pdfRateLimit = createLimiter(30, "1 m");
export const authRateLimit = createLimiter(5, "1 m");

// In-memory fallback when Upstash is not configured
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function checkMemoryRateLimit(identifier: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > limit;
}

// Map limiter instance to its config for fallback
const limiterConfigs = new Map<Ratelimit | null, { limit: number; windowMs: number }>();
limiterConfigs.set(authRateLimit, { limit: 5, windowMs: 60_000 });
limiterConfigs.set(pdfRateLimit, { limit: 30, windowMs: 60_000 });
limiterConfigs.set(emailRateLimit, { limit: 10, windowMs: 3_600_000 });

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ limited: boolean }> {
  if (!limiter) {
    // Fallback to in-memory rate limiting
    const config = limiterConfigs.get(limiter);
    if (config) {
      return { limited: checkMemoryRateLimit(identifier, config.limit, config.windowMs) };
    }
    return { limited: false };
  }

  const result = await limiter.limit(identifier);
  return { limited: !result.success };
}
