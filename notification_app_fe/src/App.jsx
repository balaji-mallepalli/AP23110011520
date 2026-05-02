/**
 * App — Root Component
 *
 * Sets up React Router with two routes:
 *   1. /                — All Notifications page
 *   2. /priority-inbox  — Priority Inbox page
 *
 * Includes a persistent top navigation bar for switching between pages.
 */

import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import {
  NotificationsOutlined,
  PriorityHighOutlined,
} from "@mui/icons-material";
import AllNotifications from "./pages/AllNotifications";
import PriorityInbox from "./pages/PriorityInbox";
import { Log } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  Navigation bar                                                     */
/* ------------------------------------------------------------------ */

/**
 * Persistent navigation bar with gradient background and route links.
 */
function NavBar() {
  const location = useLocation();

  Log("frontend", "debug", "component", `NavBar rendered — current path: ${location.pathname}`);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 4 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #06b6d4, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          🔔 CampusNotify
        </Typography>

        {/* Nav links */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={NavLink}
            to="/"
            startIcon={<NotificationsOutlined />}
            sx={{
              color: location.pathname === "/" ? "#06b6d4" : "text.secondary",
              fontWeight: location.pathname === "/" ? 700 : 500,
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              backgroundColor:
                location.pathname === "/" ? "rgba(6, 182, 212, 0.08)" : "transparent",
              "&:hover": {
                backgroundColor: "rgba(6, 182, 212, 0.12)",
              },
            }}
          >
            All
          </Button>
          <Button
            component={NavLink}
            to="/priority-inbox"
            startIcon={<PriorityHighOutlined />}
            sx={{
              color: location.pathname === "/priority-inbox" ? "#f59e0b" : "text.secondary",
              fontWeight: location.pathname === "/priority-inbox" ? 700 : 500,
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              backgroundColor:
                location.pathname === "/priority-inbox"
                  ? "rgba(245, 158, 11, 0.08)"
                  : "transparent",
              "&:hover": {
                backgroundColor: "rgba(245, 158, 11, 0.12)",
              },
            }}
          >
            Priority
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <BrowserRouter>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority-inbox" element={<PriorityInbox />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
