"use client";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { DE, GB } from "country-flag-icons/react/1x1";
import { useRouter } from "next/navigation";
import { type Locale, useLocale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function Localization() {
  const router = useRouter();
  const locale = useLocale();

  function changeLanguage(nextLocale: Locale) {
    const currentPathname =
      window.location.pathname.slice(locale.length + 1) || "/";
    const pathname =
      Object.entries(routing.pathnames).find(
        ([, localized]) =>
          typeof localized === "object" &&
          localized[locale as keyof typeof localized] === currentPathname,
      )?.[0] ?? currentPathname;

    router.replace(
      `${getPathname({ locale: nextLocale, href: pathname as Parameters<typeof getPathname>[0]["href"] })}${window.location.search}`,
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 0.75, marginRight: "2rem" }}>
      {routing.locales.map((country) => {
        const isActive = locale === country;

        return (
          <IconButton
            aria-label={country.toUpperCase()}
            aria-pressed={isActive}
            key={country}
            onClick={() => changeLanguage(country)}
          >
            {country === "de" ? (
              <DE
                title="Deutsch"
                style={{ width: 26, height: 20, scale: isActive ? 1.5 : 1 }}
              />
            ) : (
              <GB
                title="English"
                style={{ width: 26, height: 20, scale: isActive ? 1.5 : 1 }}
              />
            )}
          </IconButton>
        );
      })}
    </Box>
  );
}
