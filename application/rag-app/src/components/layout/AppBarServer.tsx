import { getTranslations } from "next-intl/server";
import { getSession, getUserRoles } from "@/lib/session";
import type { AppBarInterface } from "../../../messages/interfaces";
import AppBar from "./AppBar";

export default async function AppBarServer() {
  const [session, translation] = await Promise.all([
    getSession(),
    getTranslations("AppBar"),
  ]);
  const roles = getUserRoles(session?.accessToken);
  const links: AppBarInterface["links"] = translation.raw("links");

  return (
    <AppBar
      isAuthenticated={Boolean(session)}
      isAdmin={roles.has("admin")}
      isUser={roles.has("user")}
      userName={session?.user.name || session?.user.email || null}
      links={links}
    />
  );
}
