import { NextResponse } from "next/server";
import { CAR_API_URL } from "@/lib/api";
import { getAuthenticatedFetch } from "@/lib/services/serverFetch";

export async function GET() {
  const client = await getAuthenticatedFetch();
  if (client.status === "error") {
    return NextResponse.json(
      { status: 401, code: client.problem.code },
      { status: 401 },
    );
  }

  const response = await client.request(`${CAR_API_URL}/paypal/config`, {
    cache: "no-store",
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/json",
      "Cache-Control": "private, no-store",
    },
  });
}
