import { NextResponse } from "next/server";
import { CAR_API_URL } from "@/lib/api";
import { getSession } from "@/lib/session";

export async function GET() {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) {
    return NextResponse.json(
      { status: 401, code: "AUTHENTICATION_REQUIRED" },
      { status: 401 },
    );
  }

  const response = await fetch(`${CAR_API_URL}/paypal/config`, {
    headers: { Authorization: `Bearer ${accessToken}` },
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
