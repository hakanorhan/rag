/**
 * next-intl – Documentation: https://next-intl.dev/docs/routing/setup
 * Based on the official next-intl App Router internationalization.
 */

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de"],

  defaultLocale: "en",
});
