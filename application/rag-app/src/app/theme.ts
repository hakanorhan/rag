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
          light: "#2D9C72",
          main: "#08764D",
          dark: "#075C3E",
          contrastText: "#FFFFFF",
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
          secondary: "#526168",
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
