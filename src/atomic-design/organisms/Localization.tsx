"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@mui/material";
import { Locale, useLocale } from "next-intl";

type Props = {
  changeLocation: (locale: Locale) => Promise<void>;
};

export default function Localization() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  function changeLanguage(locale: Locale) {
    router.replace(pathname, { locale });
  }

  return (
    <div style={{ marginRight: "2rem" }}>
      {["en", "de"].map((country) => (
        <Button
          sx={{
            color: locale === country ? "white" : "primary.main",
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
