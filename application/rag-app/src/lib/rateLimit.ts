import "server-only";

import { RateLimiterMemory } from "rate-limiter-flexible";
import type { ProblemDetail } from "@/lib/problemDetails";

const rateLimiterOptions = {
  points: 1,
  duration: 60,
  blockDuration: 60,
};

const rateLimiters = {
  chat: new RateLimiterMemory(rateLimiterOptions),
  freeTextSearch: new RateLimiterMemory(rateLimiterOptions),
};

const developmentIp = "127.0.0.1";

export const rateLimitProblem = {
  type: "/problems/rate-limit-exceeded",
  status: 429,
  code: "RATE_LIMIT_EXCEEDED",
} satisfies ProblemDetail;

export async function consumeRateLimit(
  scope: keyof typeof rateLimiters,
): Promise<void> {
  await rateLimiters[scope].consume(developmentIp);
}
