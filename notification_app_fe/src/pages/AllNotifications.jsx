/**
 * All Notifications Page
 *
 * Clean dashboard layout showing all notifications with
 * type filtering, pagination, and read/unread tracking.
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
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";
import PaginationBar from "../components/PaginationBar";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "logging-middleware";

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

  useEffect(() => {
    Log("frontend", "info", "page", "All Notifications page loaded");
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, py: 4 }}>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ mb: 0.5 }}
        >
          All Notifications
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Browse all campus notifications. Click a card to mark it as read.
        </Typography>
      </Box>

      {/* Filter chips */}
      <FilterBar
        activeFilter={notificationType}
        onFilterChange={setNotificationType}
      />

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={28} sx={{ color: "#18181b" }} />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Notification grid */}
      {!loading && !error && (
        <Fade in timeout={300}>
          <Box>
            {notifications.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  No notifications found
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Try changing the filter or check back later.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {notifications.map((notification) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={notification.ID}>
                    <NotificationCard notification={notification} />
                  </Grid>
                ))}
              </Grid>
            )}

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
