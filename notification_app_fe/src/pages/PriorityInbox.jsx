import { useEffect, useState } from "react";
import {
  Box, Typography, Grid, CircularProgress, Alert, Fade,
  TextField, Chip, Divider,
} from "@mui/material";
import NotificationCard from "../components/NotificationCard";
import { usePriorityInbox } from "../hooks/usePriorityInbox";
import { useReadContext } from "../state/ReadContext";
import { Log } from "logging-middleware";

const QUICK_PICKS = [10, 15, 20, 25, 50];

export default function PriorityInbox() {
  const [topN, setTopN] = useState(10);
  const [inputValue, setInputValue] = useState("10");
  const { priorityNotifications, loading, error } = usePriorityInbox(topN);
  const { isRead } = useReadContext();

  const unreadNotifications = priorityNotifications.filter((n) => !isRead(n.ID));
  const readNotifications = priorityNotifications.filter((n) => isRead(n.ID));

  useEffect(() => { Log("frontend", "info", "page", "Priority Inbox page loaded"); }, []);
  useEffect(() => { Log("frontend", "info", "component", `PriorityInbox rendered with n=${topN}`); }, [topN, priorityNotifications.length]);

  const applyTopN = (value) => {
    const n = Math.max(1, Math.min(100, parseInt(value, 10) || 10));
    setTopN(n);
    setInputValue(String(n));
    Log("frontend", "info", "component", `topN changed to ${n}`);
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") applyTopN(inputValue);
  };

  const handleInputBlur = () => applyTopN(inputValue);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>Priority Inbox</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Your most important notifications, ranked by type and recency.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <TextField
            label="Show Top"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            type="number"
            size="small"
            slotProps={{ htmlInput: { min: 1, max: 100 } }}
            sx={{
              width: 100,
              "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: "0.85rem" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e4e4e7" },
            }}
          />
          {QUICK_PICKS.map((n) => (
            <Chip
              key={n}
              label={n}
              size="small"
              onClick={() => applyTopN(n)}
              variant={topN === n ? "filled" : "outlined"}
              sx={{
                fontWeight: topN === n ? 600 : 400,
                fontSize: "0.75rem",
                borderColor: topN === n ? "transparent" : "#e4e4e7",
                backgroundColor: topN === n ? "#18181b" : "transparent",
                color: topN === n ? "#fafafa" : "#71717a",
                "&:hover": { backgroundColor: topN === n ? "#27272a" : "#f4f4f5" },
              }}
            />
          ))}
        </Box>

        {!loading && (
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
            {priorityNotifications.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>No notifications found</Typography>
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
          </Box>
        </Fade>
      )}
    </Box>
  );
}
