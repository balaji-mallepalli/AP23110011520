import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./style/theme";
import { ReadProvider } from "./state/ReadContext";
import App from "./App";
import { Log } from "logging-middleware";

Log("frontend", "info", "page", "Application bootstrapping");

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
