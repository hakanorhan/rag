"use client";
import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";

const fieldColors = {
  backgroundColor: "var(--mui-palette-background-default)",
  color: "var(--mui-palette-text-primary)",
  borderColor: "var(--mui-palette-divider)",
};

const fieldShape = {
  minHeight: 56,
  borderRadius: "8px",
  ...fieldColors,
};

export const contentPadding = { xs: 3, md: 4 } as const;

export function locationFieldSx(error: boolean) {
  return {
    ...fieldShape,
    height: 56,
    border: error ? "1px solid var(--mui-palette-error-main)" : "none",
    "&:hover": {
      border: error
        ? "1px solid var(--mui-palette-error-main)"
        : "1px solid var(--mui-palette-primary-main)",
    },
  } as const;
}

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
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.167,
      letterSpacing: "-0.01562em",
      marginBottom: 16,
    },
    subtitle1: {
      fontSize: "1.125rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(contentPadding.xs),
          "&:last-child": { paddingBottom: theme.spacing(contentPadding.xs) },
          [theme.breakpoints.up("md")]: {
            padding: theme.spacing(contentPadding.md),
            "&:last-child": { paddingBottom: theme.spacing(contentPadding.md) },
          },
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: 0,
          paddingInline: theme.spacing(contentPadding.xs),
          paddingBottom: theme.spacing(contentPadding.xs),
          [theme.breakpoints.up("md")]: {
            paddingInline: theme.spacing(contentPadding.md),
            paddingBottom: theme.spacing(contentPadding.md),
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ ownerState, theme }) =>
          ownerState.variant === "outlined" &&
          (ownerState.component === "section" ||
            ownerState.component === "aside" ||
            ownerState.component === "form")
            ? {
                padding: theme.spacing(contentPadding.xs),
                borderRadius: 12,
                [theme.breakpoints.up("md")]: {
                  padding: theme.spacing(contentPadding.md),
                },
              }
            : {},
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&:where(main)": {
            minHeight: 640,
            paddingBottom: theme.spacing(5),
            [theme.breakpoints.up("md")]: {
              paddingBottom: theme.spacing(8),
            },
          },
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.component === "h2" && ownerState.variant !== "overline"
            ? { marginBottom: theme.spacing(2) }
            : {}),
          ...(ownerState.component === "h3" && ownerState.variant !== "overline"
            ? { marginBottom: theme.spacing(1) }
            : {}),
        }),
      },
      variants: [
        {
          props: { variant: "h1", color: "primary.main" },
          style: {
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          },
        },
      ],
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollbarColor: "var(--mui-palette-primary-main) transparent",
          scrollbarWidth: "thin",
        },
        a: {
          color: "var(--mui-palette-primary-main)",
          textDecoration: "underline",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
          borderRadius: 10,
          fontWeight: 650,
        },
        contained: {
          minHeight: 56,
          boxShadow: "0 8px 20px var(--mui-palette-primary-main)",
          transition:
            "background 160ms ease, transform 160ms ease, box-shadow 160ms ease",
          "&:hover": {
            boxShadow: "0 10px 26px var(--mui-palette-primary-main)",
          },
          "&:active": { transform: "translateY(1px)" },
          "&.Mui-focusVisible": {
            outline: "3px solid var(--mui-palette-primary-main)",
            outlineOffset: 2,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.color === "default"
            ? { color: "var(--mui-palette-text-primary)" }
            : {}),
          "&:hover": {
            backgroundColor: "transparent",
            ...(ownerState.color === "default" || ownerState.color === "inherit"
              ? { color: "var(--mui-palette-primary-main)" }
              : {}),
          },
          "&:hover .MuiAvatar-root": {
            backgroundColor: "transparent",
            color: "var(--mui-palette-primary-main)",
          },
        }),
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--mui-palette-background-paper)",
          color: "var(--mui-palette-text-primary)",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: theme.transitions.create(["box-shadow", "border-color"], {
            duration: theme.transitions.duration.short,
          }),
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          ...fieldShape,
          minHeight: ownerState.size === "small" ? 40 : fieldShape.minHeight,
          transition: theme.transitions.create("box-shadow", {
            duration: theme.transitions.duration.shorter,
          }),
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: fieldColors.borderColor,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-primary-main)",
          },
          "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-error-main)",
          },
          "&.Mui-focused": { boxShadow: theme.shadows[1] },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
            borderColor: "var(--mui-palette-primary-main)",
          },
        }),
      },
    },
    MuiPickersInputBase: {
      styleOverrides: {
        root: {
          ...fieldShape,
          "&.Mui-focused": { boxShadow: "var(--mui-shadows-1)" },
        },
      },
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: fieldColors.borderColor,
          },
          "&:hover .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-primary-main)",
          },
          "&.Mui-error:hover .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-error-main)",
          },
          "&.Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-primary-main)",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "var(--mui-palette-text-secondary)",
          fontWeight: 500,
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: { color: "var(--mui-palette-text-secondary)" },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 4,
          marginRight: 4,
          "&.Mui-error": {
            color: "var(--mui-palette-text-primary)",
            fontWeight: 700,
          },
        },
      },
    },
  },
});
