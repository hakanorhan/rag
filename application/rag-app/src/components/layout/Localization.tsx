"use client";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { DE, GB } from "country-flag-icons/react/1x1";
import { useParams } from "next/navigation";
import { type Locale, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function Localization() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();

  function changeLanguage(locale: Locale) {
    router.replace(
      {
        pathname,
        params,
        query: Object.fromEntries(new URLSearchParams(window.location.search)),
      } as Parameters<typeof router.replace>[0],
      { locale },
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
