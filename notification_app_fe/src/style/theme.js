import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#fafafa", paper: "#ffffff" },
    primary: { main: "#18181b", light: "#3f3f46", dark: "#09090b" },
    secondary: { main: "#71717a", light: "#a1a1aa", dark: "#52525b" },
    text: { primary: "#09090b", secondary: "#71717a", disabled: "#a1a1aa" },
    divider: "#e4e4e7",
    success: { main: "#16a34a" },
    warning: { main: "#ca8a04" },
    error: { main: "#dc2626" },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h4: { fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.025em", color: "#09090b" },
    h5: { fontWeight: 600, fontSize: "1.25rem", letterSpacing: "-0.02em" },
    h6: { fontWeight: 600, fontSize: "1rem" },
    subtitle2: { fontWeight: 500, fontSize: "0.875rem", color: "#71717a" },
    body1: { fontSize: "0.875rem", lineHeight: 1.6 },
    body2: { fontSize: "0.75rem", color: "#71717a" },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "#fafafa" } },
    },
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
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, fontSize: "0.75rem", letterSpacing: "0.01em", borderRadius: 6 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 6 },
        outlined: {
          borderColor: "#e4e4e7", color: "#18181b",
          "&:hover": { backgroundColor: "#f4f4f5", borderColor: "#d4d4d8" },
        },
        contained: {
          backgroundColor: "#18181b", color: "#fafafa", boxShadow: "none",
          "&:hover": { backgroundColor: "#27272a", boxShadow: "none" },
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#71717a",
          "&.Mui-selected": {
            backgroundColor: "#18181b", color: "#fafafa", fontWeight: 600,
            "&:hover": { backgroundColor: "#27272a" },
          },
        },
      },
    },
  },
});

export default theme;
