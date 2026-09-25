/**
 * next-intl – Documentation: https://next-intl.dev/docs/routing/setup
 * Based on the official next-intl App Router internationalization.
 */

import LinkHeader from "http-link-header";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  const linkHeader = response.headers.get("link");

  if (linkHeader) {
    const links = LinkHeader.parse(linkHeader);
    links.refs = links.refs.filter((entry) => entry.hreflang !== "x-default");
    response.headers.set("link", links.toString());
  }

  return response;
}

export const config = {
  matcher: ["/", "/de/:path*", "/en/:path*"],
};
