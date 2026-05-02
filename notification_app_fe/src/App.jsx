/**
 * App — Root Component
 *
 * Clean, minimal navigation bar with two routes.
 * Monochrome design matching the dashboard card aesthetic.
 */

import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button, Divider } from "@mui/material";
import {
  NotificationsNoneOutlined,
  PriorityHighOutlined,
} from "@mui/icons-material";
import AllNotifications from "./pages/AllNotifications";
import PriorityInbox from "./pages/PriorityInbox";
import { Log } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  Navigation bar                                                     */
/* ------------------------------------------------------------------ */

function NavBar() {
  const location = useLocation();

  Log("frontend", "debug", "component", `NavBar rendered — path: ${location.pathname}`);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e4e4e7",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 3 },
          display: "flex",
          justifyContent: "space-between",
          minHeight: { xs: 56 },
        }}
      >
        {/* Brand */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#09090b",
            fontSize: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          CampusNotify
        </Typography>

        {/* Nav links */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Button
            component={NavLink}
            to="/"
            startIcon={<NotificationsNoneOutlined sx={{ fontSize: 18 }} />}
            size="small"
            sx={{
              color: location.pathname === "/" ? "#09090b" : "#71717a",
              fontWeight: location.pathname === "/" ? 600 : 400,
              fontSize: "0.85rem",
              textTransform: "none",
              borderRadius: "6px",
              px: 1.5,
              backgroundColor: location.pathname === "/" ? "#f4f4f5" : "transparent",
              "&:hover": {
                backgroundColor: "#f4f4f5",
              },
            }}
          >
            All
          </Button>
          <Button
            component={NavLink}
            to="/priority-inbox"
            startIcon={<PriorityHighOutlined sx={{ fontSize: 18 }} />}
            size="small"
            sx={{
              color: location.pathname === "/priority-inbox" ? "#09090b" : "#71717a",
              fontWeight: location.pathname === "/priority-inbox" ? 600 : 400,
              fontSize: "0.85rem",
              textTransform: "none",
              borderRadius: "6px",
              px: 1.5,
              backgroundColor: location.pathname === "/priority-inbox" ? "#f4f4f5" : "transparent",
              "&:hover": {
                backgroundColor: "#f4f4f5",
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
      <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
        <NavBar />
        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority-inbox" element={<PriorityInbox />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
