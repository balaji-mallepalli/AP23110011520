/**
 * NotificationCard Component
 *
 * Renders a single notification as an MUI Card with:
 *   - Coloured type chip (Placement/Result/Event)
 *   - Unread indicator badge
 *   - Timestamp display
 *   - Click-to-mark-as-read functionality
 */

import { Card, CardContent, Chip, Typography, Box, Badge } from "@mui/material";
import {
  WorkOutlined,
  SchoolOutlined,
  EventOutlined,
  FiberManualRecord,
} from "@mui/icons-material";
import { useReadContext } from "../state/ReadContext";
import { Log } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  Type-specific configuration                                        */
/* ------------------------------------------------------------------ */

/**
 * Visual config per notification type — icon, colour, and label.
 */
const TYPE_CONFIG = {
  Placement: {
    icon: <WorkOutlined sx={{ fontSize: 16 }} />,
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.12)",
    label: "Placement",
  },
  Result: {
    icon: <SchoolOutlined sx={{ fontSize: 16 }} />,
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.12)",
    label: "Result",
  },
  Event: {
    icon: <EventOutlined sx={{ fontSize: 16 }} />,
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.12)",
    label: "Event",
  },
};

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

/**
 * Format an API timestamp string into a human-friendly relative or absolute form.
 *
 * @param {string} timestamp — e.g. "2026-04-22 17:51:30"
 * @returns {string}
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  // Fallback to formatted date
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * @param {{ notification: {ID: string, Type: string, Message: string, Timestamp: string}, showReadStatus?: boolean }} props
 */
export default function NotificationCard({ notification, showReadStatus = true }) {
  const { isRead, markRead } = useReadContext();
  const read = isRead(notification.ID);
  const config = TYPE_CONFIG[notification.Type] || TYPE_CONFIG.Event;

  /** Mark notification as read when the user clicks the card */
  const handleClick = () => {
    if (!read) {
      markRead(notification.ID);
      Log("frontend", "debug", "component", `NotificationCard clicked — marked ${notification.ID} as read`);
    }
  };

  Log("frontend", "debug", "component", `NotificationCard rendered — ID=${notification.ID}, read=${read}`);

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        position: "relative",
        opacity: read ? 0.65 : 1,
        borderLeft: `3px solid ${config.color}`,
        transition: "all 0.25s ease",
        "&:hover": {
          opacity: 1,
          borderLeftWidth: "5px",
        },
      }}
    >
      <CardContent sx={{ py: 2, px: 2.5, "&:last-child": { pb: 2 } }}>
        {/* Top row: type chip + timestamp */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.2,
          }}
        >
          <Chip
            icon={config.icon}
            label={config.label}
            size="small"
            sx={{
              backgroundColor: config.bgColor,
              color: config.color,
              border: `1px solid ${config.color}30`,
              "& .MuiChip-icon": { color: config.color },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            {/* Unread indicator dot */}
            {showReadStatus && !read && (
              <Badge
                variant="dot"
                sx={{
                  "& .MuiBadge-dot": {
                    backgroundColor: "#06b6d4",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    boxShadow: "0 0 8px rgba(6, 182, 212, 0.6)",
                  },
                }}
              >
                <FiberManualRecord sx={{ fontSize: 0 }} />
              </Badge>
            )}

            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.78rem" }}>
              {formatTimestamp(notification.Timestamp)}
            </Typography>
          </Box>
        </Box>

        {/* Notification message */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: read ? 400 : 600,
            color: read ? "text.secondary" : "text.primary",
            lineHeight: 1.5,
          }}
        >
          {notification.Message}
        </Typography>

        {/* Notification ID (subtle) */}
        <Typography
          variant="caption"
          sx={{ color: "text.disabled", mt: 0.8, display: "block", fontSize: "0.7rem" }}
        >
          ID: {notification.ID}
        </Typography>
      </CardContent>
    </Card>
  );
}
