"use client";

import "dayjs/locale/de";
import "dayjs/locale/en";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { deDE } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function DateLocalizationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const locale = useLocale();

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={locale}
      localeText={
        locale === "de"
          ? deDE.components.MuiLocalizationProvider.defaultProps.localeText
          : undefined
      }
    >
      {children}
    </LocalizationProvider>
  );
}
