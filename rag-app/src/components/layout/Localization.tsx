"use client";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { DE, GB } from "country-flag-icons/react/1x1";
import { type Locale, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function Localization() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  function changeLanguage(nextLocale: Locale) {
    const currentUrl = `${pathname}${window.location.search}${window.location.hash}`;

    router.replace(currentUrl as Parameters<typeof router.replace>[0], {
      locale: nextLocale,
      scroll: false,
    });
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
            sx={{
              width: 42,
              height: 42,
              border: "2px solid",
              borderColor: isActive ? "primary.main" : "transparent",
              backgroundColor: isActive ? "action.selected" : "transparent",
              opacity: isActive ? 1 : 0.55,
              transform: isActive ? "scale(1.08)" : "scale(1)",
              boxShadow: isActive ? 2 : 0,
              transition:
                "opacity 160ms ease, transform 160ms ease, background-color 160ms ease",
              "&:hover": {
                backgroundColor: "action.hover",
                opacity: 1,
                transform: "scale(1.08)",
              },
            }}
          >
            {country === "de" ? (
              <DE
                title="Deutsch"
                style={{ width: 26, height: 26, borderRadius: "50%" }}
              />
            ) : (
              <GB
                title="English"
                style={{ width: 26, height: 26, borderRadius: "50%" }}
              />
            )}
          </IconButton>
        );
      })}
    </Box>
  );
}
