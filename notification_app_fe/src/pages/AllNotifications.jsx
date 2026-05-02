import { useEffect } from "react";
import { Box, Typography, Grid, CircularProgress, Alert, Fade, Chip, Divider } from "@mui/material";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";
import PaginationBar from "../components/PaginationBar";
import { useNotifications } from "../hooks/useNotifications";
import { useReadContext } from "../state/ReadContext";
import { Log } from "logging-middleware";

export default function AllNotifications() {
  const {
    notifications, loading, error, page, setPage,
    notificationType, setNotificationType, hasMore,
  } = useNotifications({ initialPage: 1, limit: 10 });
  const { isRead } = useReadContext();

  const unreadNotifications = notifications.filter((n) => !isRead(n.ID));
  const readNotifications = notifications.filter((n) => isRead(n.ID));

  useEffect(() => { Log("frontend", "info", "page", "All Notifications page loaded"); }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>All Notifications</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Browse all campus notifications. Click a card to mark it as read.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <FilterBar activeFilter={notificationType} onFilterChange={setNotificationType} />
        {!loading && notifications.length > 0 && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip label={`${unreadNotifications.length} Unread`} size="small" variant="outlined"
              sx={{ fontWeight: 600, fontSize: "0.75rem", borderColor: "#e4e4e7", color: "#18181b" }} />
            <Chip label={`${readNotifications.length} Read`} size="small" variant="outlined"
              sx={{ fontWeight: 500, fontSize: "0.75rem", borderColor: "#e4e4e7", color: "#a1a1aa" }} />
          </Box>
        )}
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={28} sx={{ color: "#18181b" }} />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {!loading && !error && (
        <Fade in timeout={300}>
          <Box>
            {notifications.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>No notifications found</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>Try changing the filter or check back later.</Typography>
              </Box>
            ) : (
              <>
                {unreadNotifications.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: "#18181b", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", mb: 2 }}>
                      Unread ({unreadNotifications.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {unreadNotifications.map((n) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={n.ID}>
                          <NotificationCard notification={n} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {unreadNotifications.length > 0 && readNotifications.length > 0 && (
                  <Divider sx={{ my: 3, borderColor: "#e4e4e7" }} />
                )}

                {readNotifications.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: "#a1a1aa", fontWeight: 500, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", mb: 2 }}>
                      Read ({readNotifications.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {readNotifications.map((n) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={n.ID}>
                          <NotificationCard notification={n} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </>
            )}

            {notifications.length > 0 && (
              <PaginationBar page={page} onPageChange={setPage} hasMore={hasMore} />
            )}
          </Box>
        </Fade>
      )}
    </Box>
  );
}
