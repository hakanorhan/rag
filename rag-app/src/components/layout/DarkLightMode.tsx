// https://mui.com/material-ui/customization/dark-mode/#toggling-color-mode
"use client";

import Brightness7RoundedIcon from "@mui/icons-material/Brightness7Rounded";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Switch from "@mui/material/Switch";
import { useColorScheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

const iconSx = {
  width: 18,
  height: 18,
  padding: "3.5px",
  boxSizing: "border-box",
  borderRadius: "50%",
};

export default function DarkLightMode() {
  const { mode, systemMode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !mode) {
    return (
      <span
        aria-hidden="true"
        style={{ display: "inline-block", width: 46, height: 24 }}
      />
    );
  }

  const isDark =
    mode === "dark" || (mode === "system" && systemMode === "dark");

  return (
    <Switch
      checked={isDark}
      onChange={(_, checked) => setMode(checked ? "dark" : "light")}
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
          "aria-label": isDark ? "Switch to light mode" : "Switch to dark mode",
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
