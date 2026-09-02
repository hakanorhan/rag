"use client";
import Button from "@mui/material/Button";
import { type Locale, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function Localization() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  function changeLanguage(locale: Locale) {
    router.replace(pathname, { locale });
  }

  return (
    <div style={{ marginRight: "2rem" }}>
      {routing.locales.map((country) => (
        <Button
          sx={{
            color: locale === country ? "black" : "primary.main",
            backgroundColor:
              locale === country ? "primary.main" : "transparent",
            minWidth: 0,
            padding: "0.2rem",
          }}
          key={country}
          onClick={() => changeLanguage(country)}
        >
          {country.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
