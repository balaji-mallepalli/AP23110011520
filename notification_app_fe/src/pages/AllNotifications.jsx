/**
 * All Notifications Page
 *
 * Displays every notification from the campus system with:
 *   - Type-based filtering (Event / Result / Placement)
 *   - Pagination (10 per page)
 *   - Visual distinction between read and unread items
 *   - Responsive grid layout
 */

import { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Fade,
} from "@mui/material";
import { NotificationsActiveOutlined } from "@mui/icons-material";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";
import PaginationBar from "../components/PaginationBar";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AllNotifications() {
  const {
    notifications,
    loading,
    error,
    page,
    setPage,
    notificationType,
    setNotificationType,
    hasMore,
  } = useNotifications({ initialPage: 1, limit: 10 });

  // Log page load
  useEffect(() => {
    Log("frontend", "info", "page", "All Notifications page loaded");
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <NotificationsActiveOutlined
            sx={{
              fontSize: 32,
              background: "linear-gradient(135deg, #06b6d4, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          />
          <Typography
            variant="h4"
            sx={{
              background: "linear-gradient(135deg, #06b6d4, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            All Notifications
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Browse all campus notifications. Click a notification to mark it as read.
        </Typography>
      </Box>

      {/* Filter chips */}
      <FilterBar
        activeFilter={notificationType}
        onFilterChange={setNotificationType}
      />

      {/* Loading spinner */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress
            sx={{
              color: "#06b6d4",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        </Box>
      )}

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Notification grid */}
      {!loading && !error && (
        <Fade in timeout={400}>
          <Box>
            {notifications.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                <Typography variant="h6">No notifications found</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Try changing the filter or check back later.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {notifications.map((notification) => (
                  <Grid item xs={12} sm={6} md={4} key={notification.ID}>
                    <NotificationCard notification={notification} />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Pagination */}
            {notifications.length > 0 && (
              <PaginationBar
                page={page}
                onPageChange={setPage}
                hasMore={hasMore}
              />
            )}
          </Box>
        </Fade>
      )}
    </Box>
  );
}
