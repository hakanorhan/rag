import "server-only";

const AI_SERVICE_URL = "http://aiservice:8081";

export async function postJson(
  path: string,
  body: unknown,
  requestName: string,
): Promise<unknown> {
  const response = await fetch(`${AI_SERVICE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`${requestName} failed with status ${response.status}`);
  }

  return response.json();
}
