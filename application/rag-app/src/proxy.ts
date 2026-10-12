/**
 * next-intl – Documentation: https://next-intl.dev/docs/routing/setup
 * Based on the official next-intl App Router internationalization.
 */

import { getSessionCookie } from "better-auth/cookies";
import LinkHeader from "http-link-header";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getLoginUrl } from "./lib/loginUrl";

const handleI18nRouting = createMiddleware(routing);

const protectedRoutes = routing.locales.flatMap((locale) => [
  `/${locale}/admin`,
  `/${locale}${routing.pathnames["/profile"][locale]}`,
  `/${locale}${routing.pathnames["/my-reservations"][locale]}`,
  `/${locale}/reservation-car`,
]);

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export default function proxy(request: NextRequest) {
  if (isProtectedRoute(request.nextUrl.pathname)) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      const loginUrl = new URL(
        getLoginUrl(`${request.nextUrl.pathname}${request.nextUrl.search}`),
        request.url,
      );

      return NextResponse.redirect(loginUrl);
    }
  }

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
