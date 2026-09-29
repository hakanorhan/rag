import { NextResponse } from "next/server";
import { getSession, getUserRoles } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  const roles = getUserRoles(session?.accessToken);

  return NextResponse.json(
    {
      isAdmin: roles.has("admin"),
      isUser: roles.has("user"),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
