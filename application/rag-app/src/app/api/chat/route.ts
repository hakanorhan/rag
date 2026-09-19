import { RateLimiterMemory } from "rate-limiter-flexible";
import { AI_API_URL } from "@/lib/api";
import { getChatSession } from "@/lib/chatSession";

const chatRateLimiter = new RateLimiterMemory({
  points: 1,
  duration: 60,
  blockDuration: 60,
});

const developmentIp = "127.0.0.1";

export async function POST(request: Request) {
  try {
    await chatRateLimiter.consume(developmentIp);
  } catch {
    return Response.json(
      {
        type: "/problems/rate-limit-exceeded",
        status: 429,
        code: "RATE_LIMIT_EXCEEDED",
      },
      {
        status: 429,
        headers: { "Content-Type": "application/problem+json" },
      },
    );
  }

  const body = await request.json();
  const session = await getChatSession();
  const response = await fetch(`${AI_API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...body,
      ...(session.conversationId && {
        conversationId: session.conversationId,
      }),
    }),
  });

  if (!response.body) {
    return new Response(null, { status: 502 });
  }

  const reader = response.body.getReader();
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        reader.releaseLock();
        controller.close();
        return;
      }
      controller.enqueue(value);
    },
    async cancel(reason) {
      await reader.cancel(reason);
    },
  });

  return new Response(stream, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Content-Encoding": "identity",
      "X-Accel-Buffering": "no",
    },
  });
}
