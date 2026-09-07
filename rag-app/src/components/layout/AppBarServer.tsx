import { getTranslations } from "next-intl/server";
import { getUserNavigation } from "@/lib/session";
import type { AppBarInterface } from "../../../messages/interfaces";
import AppBar from "./AppBar";

export default async function AppBarServer() {
  const [userNavigation, translation] = await Promise.all([
    getUserNavigation(),
    getTranslations("AppBar"),
  ]);
  const links: AppBarInterface["links"] = translation.raw("links");

  return <AppBar {...userNavigation} links={links} />;
}
