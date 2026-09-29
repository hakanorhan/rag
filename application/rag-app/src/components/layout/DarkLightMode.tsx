// https://mui.com/material-ui/customization/dark-mode/#toggling-color-mode
"use client";

import Brightness7RoundedIcon from "@mui/icons-material/Brightness7Rounded";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Switch from "@mui/material/Switch";
import { useColorScheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";

const iconSx = {
  width: 18,
  height: 18,
  padding: "3.5px",
  boxSizing: "border-box",
  borderRadius: "50%",
};

export default function DarkLightMode() {
  const t = useTranslations("AppBar.theme");
  const { mode, setMode } = useColorScheme();
  const isDark = mode === "dark";

  return (
    <Switch
      checked={isDark}
      onChange={(_, checked) => {
        const nextMode = checked ? "dark" : "light";
        document.cookie = `mui-mode=${nextMode}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
        setMode(nextMode);
      }}
      icon={
        <Brightness7RoundedIcon
          aria-hidden="true"
          sx={{
            ...iconSx,
            backgroundColor: "warning.main",
            color: "warning.contrastText",
          }}
        />
      }
      checkedIcon={
        <DarkModeOutlinedIcon
          aria-hidden="true"
          sx={{
            ...iconSx,
            backgroundColor: "primary.main",
            color: "primary.contrastText",
          }}
        />
      }
      slotProps={{
        input: {
          "aria-label": isDark ? t("switchToLight") : t("switchToDark"),
        },
      }}
      sx={{
        width: 46,
        height: 24,
        padding: 0,

        "& .MuiSwitch-switchBase": {
          width: 24,
          height: 24,
          padding: "3px",

          "&.Mui-checked": {
            transform: "translateX(22px)",
          },
        },

        "& .MuiSwitch-track": {
          borderRadius: 12,
          opacity: 1,
          backgroundColor: "transparent",
          border: "1px solid",
          borderColor: "text.disabled",
        },

        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "transparent",
        },
      }}
    />
  );
}
