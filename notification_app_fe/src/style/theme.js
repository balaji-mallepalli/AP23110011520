/**
 * MUI Theme Configuration
 *
 * Clean, professional light theme inspired by modern dashboard UIs.
 * Monochrome palette with subtle accents for notification types.
 */

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    primary: {
      main: "#18181b",      // Zinc 900
      light: "#3f3f46",     // Zinc 700
      dark: "#09090b",      // Zinc 950
    },
    secondary: {
      main: "#71717a",      // Zinc 500
      light: "#a1a1aa",     // Zinc 400
      dark: "#52525b",      // Zinc 600
    },
    text: {
      primary: "#09090b",   // Zinc 950
      secondary: "#71717a", // Zinc 500
      disabled: "#a1a1aa",  // Zinc 400
    },
    divider: "#e4e4e7",     // Zinc 200
    success: {
      main: "#16a34a",      // Green 600 — for Result badges
    },
    warning: {
      main: "#ca8a04",      // Yellow 600 — for Event badges
    },
    error: {
      main: "#dc2626",      // Red 600
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 700,
      fontSize: "1.5rem",
      letterSpacing: "-0.025em",
      color: "#09090b",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.875rem",
      color: "#71717a",
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.75rem",
      color: "#71717a",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#fafafa",
        },
      },
    },
    /** Card — clean border, subtle shadow, hover lift */
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #e4e4e7",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.2s ease, transform 0.15s ease",
          "&:hover": {
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)",
          },
        },
      },
    },
    /** Chip — clean, minimal pill */
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: "0.75rem",
          letterSpacing: "0.01em",
          borderRadius: 6,
        },
      },
    },
    /** Button — clean outline style */
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 6,
        },
        outlined: {
          borderColor: "#e4e4e7",
          color: "#18181b",
          "&:hover": {
            backgroundColor: "#f4f4f5",
            borderColor: "#d4d4d8",
          },
        },
        contained: {
          backgroundColor: "#18181b",
          color: "#fafafa",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#27272a",
            boxShadow: "none",
          },
        },
      },
    },
    /** Pagination — monochrome selected state */
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#71717a",
          "&.Mui-selected": {
            backgroundColor: "#18181b",
            color: "#fafafa",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#27272a",
            },
          },
        },
      },
    },
  },
});

export default theme;
