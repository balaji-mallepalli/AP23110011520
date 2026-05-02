/**
 * Priority Inbox Page
 *
 * Displays the top N most important notifications, ranked by:
 *   1. Type weight: Placement (3) > Result (2) > Event (1)
 *   2. Recency: newer timestamps win within the same weight
 *
 * Users can select N (10, 15, 20) via a dropdown selector.
 * Unread notifications are visually emphasised at the top.
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
} from "@mui/material";
import { PriorityHighOutlined } from "@mui/icons-material";
import NotificationCard from "../components/NotificationCard";
import { usePriorityInbox } from "../hooks/usePriorityInbox";
import { useReadContext } from "../state/ReadContext";
import { Log } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

/** Available top-N options */
const TOP_N_OPTIONS = [10, 15, 20, 25, 30];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PriorityInbox() {
  const [topN, setTopN] = useState(10);
  const { priorityNotifications, loading, error } = usePriorityInbox(topN);
  const { isRead } = useReadContext();

  // Separate unread and read notifications for display ordering
  const unreadNotifications = priorityNotifications.filter((n) => !isRead(n.ID));
  const readNotifications = priorityNotifications.filter((n) => isRead(n.ID));

  // Log page load
  useEffect(() => {
    Log("frontend", "info", "page", "Priority Inbox page loaded");
  }, []);

  // Log when topN or render count changes
  useEffect(() => {
    Log("frontend", "info", "component", `PriorityInbox rendered with n=${topN}`);
  }, [topN, priorityNotifications.length]);

  /** Handle top-N selector change */
  const handleTopNChange = (event) => {
    const newN = event.target.value;
    Log("frontend", "info", "component", `PriorityInbox: topN changed to ${newN}`);
    setTopN(newN);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <PriorityHighOutlined
            sx={{
              fontSize: 32,
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          />
          <Typography
            variant="h4"
            sx={{
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Priority Inbox
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Your most important notifications, ranked by type priority and recency.
        </Typography>
      </Box>

      {/* Controls row — top-N selector + stats */}
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
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="topn-label" sx={{ color: "text.secondary" }}>
            Show Top
          </InputLabel>
          <Select
            labelId="topn-label"
            value={topN}
            label="Show Top"
            onChange={handleTopNChange}
            sx={{
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.12)",
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

        {/* Stats chips */}
        {!loading && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={`${unreadNotifications.length} Unread`}
              size="small"
              sx={{
                backgroundColor: "rgba(6, 182, 212, 0.12)",
                color: "#06b6d4",
                fontWeight: 600,
              }}
            />
            <Chip
              label={`${readNotifications.length} Read`}
              size="small"
              sx={{
                backgroundColor: "rgba(148, 163, 184, 0.12)",
                color: "#94a3b8",
                fontWeight: 600,
              }}
            />
          </Box>
        )}
      </Box>

      {/* Loading spinner */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress
            sx={{
              color: "#f59e0b",
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

      {/* Priority notification grid — unread first, then read */}
      {!loading && !error && (
        <Fade in timeout={400}>
          <Box>
            {priorityNotifications.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                <Typography variant="h6">No notifications found</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Check back later for new notifications.
                </Typography>
              </Box>
            ) : (
              <>
                {/* Unread notifications section */}
                {unreadNotifications.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#06b6d4",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        mb: 2,
                        fontWeight: 700,
                      }}
                    >
                      ● Unread ({unreadNotifications.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {unreadNotifications.map((notification) => (
                        <Grid item xs={12} sm={6} md={4} key={notification.ID}>
                          <NotificationCard notification={notification} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Read notifications section */}
                {readNotifications.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "text.disabled",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        mb: 2,
                        fontWeight: 700,
                      }}
                    >
                      ● Read ({readNotifications.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {readNotifications.map((notification) => (
                        <Grid item xs={12} sm={6} md={4} key={notification.ID}>
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
