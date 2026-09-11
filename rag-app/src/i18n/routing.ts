/**
 * next-intl – Documentation: https://next-intl.dev/docs/routing/setup
 * Based on the official next-intl App Router internationalization.
 */

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de"],

  defaultLocale: "en",

  pathnames: {
    "/": "/",
    "/cars": {
      en: "/cars",
      de: "/autos",
    },
    "/fleet": {
      en: "/fleet",
      de: "/fuhrpark",
    },
    "/about-us": {
      en: "/about-us",
      de: "/ueber-uns",
    },
    "/contact": {
      en: "/contact",
      de: "/kontakt",
    },
    "/my-reservations": {
      en: "/my-reservations",
      de: "/meine-reservierungen",
    },
    "/admin/rag/edit": "/admin/rag/edit",
    "/reservation-car/new/[carId]": "/reservation-car/new/[carId]",
    "/reservation-car/[reservationId]": "/reservation-car/[reservationId]",
  },
});
