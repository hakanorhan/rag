import { toNextJsHandler } from "better-auth/next-js";
import { loadAuthConfig } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(async (request) => {
  const { auth } = await loadAuthConfig();
  return auth.handler(request);
});
