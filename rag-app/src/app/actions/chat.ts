"use server";

import { headers } from "next/headers";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { getChatSession } from "@/lib/chatSession";
import { ProblemDetailError } from "@/lib/problemDetails";
import { requestChatAnswer } from "@/lib/services/ai";

const chatRateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60,
  blockDuration: 60,
});

async function getClientIp() {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("x-real-ip") ??
    requestHeaders.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ??
    "unknown"
  );
}

export async function askChat(message: string) {
  try {
    await chatRateLimiter.consume(await getClientIp());
  } catch {
    return {
      status: "error" as const,
      problem: {
        type: "/problems/rate-limit-exceeded",
        status: 429,
        code: "RATE_LIMIT_EXCEEDED",
      },
    };
  }

  try {
    const session = await getChatSession();
    const response = await requestChatAnswer(message, session.conversationId);

    if (session.conversationId !== response.conversationId) {
      session.conversationId = response.conversationId;
      await session.save();
    }

    return { status: "success" as const, answer: response.answer };
  } catch (error) {
    if (error instanceof ProblemDetailError) {
      return {
        status: "error" as const,
        problem: error.problem,
      };
    }
    throw error;
  }
}
