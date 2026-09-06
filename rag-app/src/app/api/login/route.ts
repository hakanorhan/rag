import type { NextRequest } from "next/server";
import { AUTH_PROVIDER, auth, getAppUrl } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const baseURL = getAppUrl(request.url);
  const returnTo = request.nextUrl.searchParams.get("returnTo") ?? "/";
  const target = URL.canParse(returnTo, baseURL)
    ? new URL(returnTo, baseURL)
    : new URL("/", baseURL);
  const callbackURL =
    target.origin === baseURL.origin
      ? `${target.pathname}${target.search}`
      : "/";

  const { response, headers } = await auth.api.signInSocial({
    headers: request.headers,
    body: { provider: AUTH_PROVIDER, callbackURL },
    returnHeaders: true,
  });

  if (!response.url) {
    return new Response("Login unavailable", { status: 502 });
  }

  headers.set("Location", response.url);
  headers.set("Cache-Control", "no-store");
  return new Response(null, { status: 303, headers });
}
