import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import {
  WorkOutlined, SchoolOutlined, EventOutlined,
  CircleOutlined, CheckCircleOutlined,
} from "@mui/icons-material";
import { useReadContext } from "../state/ReadContext";
import { Log } from "logging-middleware";

const TYPE_CONFIG = {
  Placement: {
    icon: WorkOutlined, color: "#7c3aed", bg: "#f5f3ff",
    borderColor: "#ddd6fe", label: "Placement",
  },
  Result: {
    icon: SchoolOutlined, color: "#16a34a", bg: "#f0fdf4",
    borderColor: "#bbf7d0", label: "Result",
  },
  Event: {
    icon: EventOutlined, color: "#ca8a04", bg: "#fefce8",
    borderColor: "#fef08a", label: "Event",
  },
};

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

  return date.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function NotificationCard({ notification, showReadStatus = true }) {
  const { isRead, markRead } = useReadContext();
  const read = isRead(notification.ID);
  const config = TYPE_CONFIG[notification.Type] || TYPE_CONFIG.Event;
  const IconComponent = config.icon;

  const handleClick = () => {
    if (!read) {
      markRead(notification.ID);
      Log("frontend", "debug", "component", `Marked ${notification.ID} as read`);
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        opacity: read ? 0.55 : 1,
        transition: "all 0.2s ease",
        "&:hover": { transform: read ? "none" : "translateY(-1px)" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, pt: 2, pb: 0.5 }}>
        <Typography variant="body2" sx={{ fontSize: "0.8rem", fontWeight: 500, color: "text.secondary" }}>
          {config.label}
        </Typography>
        <IconComponent sx={{ fontSize: 16, color: "text.disabled" }} />
      </Box>

      <CardContent sx={{ flexGrow: 1, px: 2.5, pt: 1, pb: 1.5 }}>
        <Typography variant="h6" sx={{ fontSize: "1.15rem", fontWeight: 700, color: "text.primary", mb: 0.5, lineHeight: 1.3 }}>
          {notification.Message}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "text.secondary", minHeight: "1.5rem" }}>
          {formatTimestamp(notification.Timestamp)}
        </Typography>
      </CardContent>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, pb: 2, pt: 0 }}>
        {showReadStatus && (
          <Chip
            icon={read ? <CheckCircleOutlined sx={{ fontSize: 14 }} /> : <CircleOutlined sx={{ fontSize: 14 }} />}
            label={read ? "Read" : "Unread"}
            size="small"
            variant="outlined"
            sx={{
              fontSize: "0.7rem", fontWeight: 600, height: 26,
              borderColor: read ? "#d4d4d8" : config.borderColor,
              color: read ? "#a1a1aa" : config.color,
              backgroundColor: read ? "transparent" : config.bg,
              "& .MuiChip-icon": { color: read ? "#a1a1aa" : config.color },
            }}
          />
        )}
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: read ? "#d4d4d8" : config.color, flexShrink: 0 }} />
      </Box>
    </Card>
  );
}
