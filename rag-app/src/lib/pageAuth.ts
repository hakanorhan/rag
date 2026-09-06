import "server-only";

import { redirect } from "next/navigation";
import { getAccessToken, getLoginUrl } from "@/lib/session";

type PageAccessInput = {
  returnTo: string;
};

export async function requirePageAccess(input: PageAccessInput) {
  const loginUrl = getLoginUrl(input.returnTo);
  const accessToken = await getAccessToken();
  if (!accessToken) redirect(loginUrl);

  return { accessToken, loginUrl };
}
