/**
 * next-intl –  Documentation: https://next-intl.dev/docs/getting-started/app-router, https://next-intl.dev/docs/routing/setup
 * Based on the official next-intl App Router internationalization, customized for project-specific requirements.
 */

import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { TIME_ZONE } from "@/lib/dateTime";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale: localeOverride }) => {
  const locale = localeOverride ?? (await rootParams.locale());

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: TIME_ZONE,
  };
});
