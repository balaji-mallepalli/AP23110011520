import { Box, Chip } from "@mui/material";
import { InboxOutlined, EventOutlined, SchoolOutlined, WorkOutlined } from "@mui/icons-material";
import { Log } from "logging-middleware";

const FILTERS = [
  { label: "All", value: null, icon: <InboxOutlined sx={{ fontSize: 16 }} /> },
  { label: "Event", value: "Event", icon: <EventOutlined sx={{ fontSize: 16 }} /> },
  { label: "Result", value: "Result", icon: <SchoolOutlined sx={{ fontSize: 16 }} /> },
  { label: "Placement", value: "Placement", icon: <WorkOutlined sx={{ fontSize: 16 }} /> },
];

export default function FilterBar({ activeFilter, onFilterChange }) {
  const handleClick = (value) => {
    Log("frontend", "info", "component", `Filter changed to "${value || "all"}"`);
    onFilterChange(value);
  };

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <Chip
            key={filter.label}
            icon={filter.icon}
            label={filter.label}
            onClick={() => handleClick(filter.value)}
            variant={isActive ? "filled" : "outlined"}
            sx={{
              px: 0.5, py: 2.2, fontSize: "0.8rem",
              fontWeight: isActive ? 600 : 400,
              borderColor: isActive ? "transparent" : "#e4e4e7",
              backgroundColor: isActive ? "#18181b" : "transparent",
              color: isActive ? "#fafafa" : "#71717a",
              transition: "all 0.15s ease",
              "& .MuiChip-icon": { color: isActive ? "#fafafa" : "#a1a1aa" },
              "&:hover": {
                backgroundColor: isActive ? "#27272a" : "#f4f4f5",
                borderColor: isActive ? "transparent" : "#d4d4d8",
              },
            }}
          />
        );
      })}
    </Box>
  );
}
