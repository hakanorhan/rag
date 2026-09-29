import { getTranslations } from "next-intl/server";
import type { AppBarInterface } from "../../../messages/interfaces";
import AppBar from "./AppBar";

export default async function AppBarServer() {
  const translation = await getTranslations("AppBar");
  const links: AppBarInterface["links"] = translation.raw("links");

  return <AppBar links={links} />;
}
