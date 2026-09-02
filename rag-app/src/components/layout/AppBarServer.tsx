import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import type { AppBarInterface } from "../../../messages/interfaces";
import AppBar from "./AppBar";

type AppBarServerProps = {
  backgroundColor: string;
};

export default async function AppBarServer({
  backgroundColor,
}: AppBarServerProps) {
  const [session, translation] = await Promise.all([
    headers().then((requestHeaders) =>
      auth.api.getSession({ headers: requestHeaders }),
    ),
    getTranslations("AppBar"),
  ]);
  const links: AppBarInterface["links"] = translation.raw("links");

  return (
    <AppBar
      backgroundColor={backgroundColor}
      isAuthenticated={Boolean(session)}
      links={links}
    />
  );
}
