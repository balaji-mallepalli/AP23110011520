/**
 * Application Entry Point
 *
 * Sets up:
 *   - MUI ThemeProvider with the custom dark theme
 *   - CssBaseline for consistent cross-browser defaults
 *   - ReadProvider for read/unread notification tracking
 *   - Google Fonts (Inter) loaded via link in index.html
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./style/theme";
import { ReadProvider } from "./state/ReadContext";
import App from "./App";
import { Log } from "logging-middleware";

// Log application bootstrap
Log("frontend", "info", "page", "Application bootstrapping — mounting React root");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReadProvider>
        <App />
      </ReadProvider>
    </ThemeProvider>
  </StrictMode>
);
