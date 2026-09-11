"use client";
import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          light: "#D7F3E8",
          main: "#087A5B",
          dark: "#056247",
          contrastText: "#FFFFFF",
        },
        background: {
          default: "#F1F6F3",
          paper: "#FBFDFC",
        },
        text: {
          primary: "#14211B",
          secondary: "#52625A",
          disabled: "#84918B",
        },
      },
    },

    dark: {
      palette: {
        primary: {
          light: "#96F4C1",
          main: "#67E8A5",
          dark: "#42C984",
          contrastText: "#0B1711",
        },
        background: {
          default: "#182126",
          paper: "#222E33",
        },
        text: {
          primary: "#F2F7F4",
          secondary: "#A7B3AD",
          disabled: "#6F7C76",
        },
      },
    },
  },

  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Inter, Arial, sans-serif',
  },
});

