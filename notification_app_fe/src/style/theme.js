/**
 * MUI Theme Configuration
 *
 * A polished dark theme with vibrant accent colors for the campus
 * notification system. Uses a deep navy background with cyan/purple
 * accent gradients for a premium, modern aesthetic.
 */

import { createTheme } from "@mui/material/styles";

/**
 * Custom colour palette constants.
 * Using HSL-based values for precise control over saturation and lightness.
 */
const PALETTE = {
  background: {
    default: "#0a0e1a",    // Deep navy — main app background
    paper:   "#111827",    // Slightly lighter — card surfaces
    card:    "#1a2235",    // Card background with subtle distinction
  },
  primary: {
    main:  "#06b6d4",      // Cyan 500 — primary accent
    light: "#22d3ee",      // Cyan 400 — hover states
    dark:  "#0891b2",      // Cyan 600 — pressed states
  },
  secondary: {
    main:  "#a855f7",      // Purple 500 — secondary accent
    light: "#c084fc",      // Purple 400
    dark:  "#7c3aed",      // Violet 600
  },
  success: {
    main: "#10b981",       // Emerald 500 — Result type badge
  },
  warning: {
    main: "#f59e0b",       // Amber 500 — Event type badge
  },
  error: {
    main: "#ef4444",       // Red 500 — errors
  },
  text: {
    primary:   "#f1f5f9",  // Slate 100
    secondary: "#94a3b8",  // Slate 400
    disabled:  "#475569",  // Slate 600
  },
};

const theme = createTheme({
  palette: {
    mode: "dark",
    background: PALETTE.background,
    primary:    PALETTE.primary,
    secondary:  PALETTE.secondary,
    success:    PALETTE.success,
    warning:    PALETTE.warning,
    error:      PALETTE.error,
    text:       PALETTE.text,
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.85rem",
      color: PALETTE.text.secondary,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    /** Card styling — glassmorphic effect with subtle border */
    MuiCard: {
      styleOverrides: {
        root: {
          background: PALETTE.background.card,
          border: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.25)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 32px rgba(6, 182, 212, 0.15)",
          },
        },
      },
    },
    /** Chip styling — pill shape with subtle glow */
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.75rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        },
      },
    },
    /** Button styling — gradient background on contained variant */
    MuiButton: {
      styleOverrides: {
        contained: {
          background: `linear-gradient(135deg, ${PALETTE.primary.main}, ${PALETTE.secondary.main})`,
          boxShadow: "0 4px 16px rgba(6, 182, 212, 0.3)",
          "&:hover": {
            background: `linear-gradient(135deg, ${PALETTE.primary.light}, ${PALETTE.secondary.light})`,
            boxShadow: "0 6px 20px rgba(6, 182, 212, 0.4)",
          },
        },
      },
    },
    /** Pagination — styled for dark mode */
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: PALETTE.text.secondary,
          "&.Mui-selected": {
            background: `linear-gradient(135deg, ${PALETTE.primary.main}, ${PALETTE.secondary.main})`,
            color: "#fff",
            fontWeight: 600,
          },
        },
      },
    },
  },
});

export default theme;
