import { getTranslations } from "next-intl/server";
import { getUserNavigation } from "@/lib/session";
import type { AppBarInterface } from "../../../messages/interfaces";
import AppBar from "./AppBar";

type AppBarServerProps = {
  backgroundColor: string;
};

export default async function AppBarServer({
  backgroundColor,
}: AppBarServerProps) {
  const [userNavigation, translation] = await Promise.all([
    getUserNavigation(),
    getTranslations("AppBar"),
  ]);
  const links: AppBarInterface["links"] = translation.raw("links");

  return (
    <AppBar
      backgroundColor={backgroundColor}
      {...userNavigation}
      links={links}
    />
  );
}
