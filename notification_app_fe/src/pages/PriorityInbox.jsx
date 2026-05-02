/**
 * Priority Inbox Page
 *
 * Displays top N priority-ranked notifications in a clean
 * dashboard card grid. Unread items appear first, read items below.
 */

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Fade,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Divider,
} from "@mui/material";
import NotificationCard from "../components/NotificationCard";
import { usePriorityInbox } from "../hooks/usePriorityInbox";
import { useReadContext } from "../state/ReadContext";
import { Log } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const TOP_N_OPTIONS = [10, 15, 20, 25, 30];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PriorityInbox() {
  const [topN, setTopN] = useState(10);
  const { priorityNotifications, loading, error } = usePriorityInbox(topN);
  const { isRead } = useReadContext();

  const unreadNotifications = priorityNotifications.filter((n) => !isRead(n.ID));
  const readNotifications = priorityNotifications.filter((n) => isRead(n.ID));

  useEffect(() => {
    Log("frontend", "info", "page", "Priority Inbox page loaded");
  }, []);

  useEffect(() => {
    Log("frontend", "info", "component", `PriorityInbox rendered with n=${topN}`);
  }, [topN, priorityNotifications.length]);

  const handleTopNChange = (event) => {
    const newN = event.target.value;
    Log("frontend", "info", "component", `PriorityInbox: topN changed to ${newN}`);
    setTopN(newN);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, py: 4 }}>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          Priority Inbox
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Your most important notifications, ranked by type and recency.
        </Typography>
      </Box>

      {/* Controls row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id="topn-label">Show Top</InputLabel>
          <Select
            labelId="topn-label"
            value={topN}
            label="Show Top"
            onChange={handleTopNChange}
            sx={{
              borderRadius: "6px",
              fontSize: "0.85rem",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e4e4e7",
              },
            }}
          >
            {TOP_N_OPTIONS.map((n) => (
              <MenuItem key={n} value={n}>
                Top {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Stats */}
        {!loading && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={`${unreadNotifications.length} Unread`}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                borderColor: "#e4e4e7",
                color: "#18181b",
              }}
            />
            <Chip
              label={`${readNotifications.length} Read`}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 500,
                fontSize: "0.75rem",
                borderColor: "#e4e4e7",
                color: "#a1a1aa",
              }}
            />
          </Box>
        )}
      </Box>

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

      {/* Priority notification grid */}
      {!loading && !error && (
        <Fade in timeout={300}>
          <Box>
            {priorityNotifications.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  No notifications found
                </Typography>
              </Box>
            ) : (
              <>
                {/* Unread section */}
                {unreadNotifications.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#18181b",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        mb: 2,
                      }}
                    >
                      Unread ({unreadNotifications.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {unreadNotifications.map((notification) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={notification.ID}>
                          <NotificationCard notification={notification} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Divider between sections */}
                {unreadNotifications.length > 0 && readNotifications.length > 0 && (
                  <Divider sx={{ my: 3, borderColor: "#e4e4e7" }} />
                )}

                {/* Read section */}
                {readNotifications.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#a1a1aa",
                        fontWeight: 500,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        mb: 2,
                      }}
                    >
                      Read ({readNotifications.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {readNotifications.map((notification) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={notification.ID}>
                          <NotificationCard notification={notification} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Fade>
      )}
    </Box>
  );
}
