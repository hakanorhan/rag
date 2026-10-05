import { AI_API_URL } from "@/lib/api";
import { consumeRateLimit, rateLimitProblem } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    await consumeRateLimit("chat");
  } catch {
    return Response.json(rateLimitProblem, {
      status: 429,
      headers: { "Content-Type": "application/problem+json" },
    });
  }

  const body = await request.json();
  const response = await fetch(`${AI_API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: request.signal,
  });

  if (!response.body) {
    return new Response(null, { status: 502 });
  }

  return new Response(response.body, {
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
