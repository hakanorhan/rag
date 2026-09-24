"use client";
import { createTheme } from "@mui/material/styles";

export const hoverTheme = {
  backgroundColor: "transparent",
  color: "primary.main",
};

export const appTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          light: "#48D39A",
          main: "#35C98B",
          dark: "#2DBA80",
          contrastText: "#102019",
        },
        secondary: {
          main: "#506872",
        },
        background: {
          default: "#F5F7F8",
          paper: "#FFFFFF",
        },
        text: {
          primary: "#182126",
          secondary: "#66747A",
          disabled: "#8A989E",
        },
        divider: "#D9E0E3",
      },
    },

    dark: {
      palette: {
        primary: {
          light: "#76EDB2",
          main: "#63E6A5",
          dark: "#76EDB2",
          contrastText: "#101719",
        },
        secondary: {
          main: "#5E7782",
        },
        background: {
          default: "#121A1E",
          paper: "#182126",
        },
        text: {
          primary: "#F5F5F5",
          secondary: "#A8B1B5",
          disabled: "#78868C",
        },
        divider: "#334148",
      },
    },
  },

  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Inter, Arial, sans-serif',
  },
});
