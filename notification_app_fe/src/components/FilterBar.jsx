/**
 * FilterBar Component
 *
 * Renders a row of MUI Chips that allow the user to filter notifications
 * by type (All, Event, Result, Placement). The active filter is visually
 * highlighted with a gradient background.
 */

import { Box, Chip } from "@mui/material";
import {
  AllInboxOutlined,
  EventOutlined,
  SchoolOutlined,
  WorkOutlined,
} from "@mui/icons-material";
import { Log } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  Filter definitions                                                 */
/* ------------------------------------------------------------------ */

/**
 * Available filter options. `value: null` means "show all types".
 */
const FILTERS = [
  { label: "All", value: null, icon: <AllInboxOutlined sx={{ fontSize: 18 }} /> },
  { label: "Event", value: "Event", icon: <EventOutlined sx={{ fontSize: 18 }} /> },
  { label: "Result", value: "Result", icon: <SchoolOutlined sx={{ fontSize: 18 }} /> },
  { label: "Placement", value: "Placement", icon: <WorkOutlined sx={{ fontSize: 18 }} /> },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * @param {{
 *   activeFilter: string | null,
 *   onFilterChange: (value: string | null) => void
 * }} props
 */
export default function FilterBar({ activeFilter, onFilterChange }) {
  const handleClick = (value) => {
    Log("frontend", "info", "component", `FilterBar: filter changed to "${value || "all"}"`);
    onFilterChange(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.2,
        flexWrap: "wrap",
        mb: 3,
      }}
    >
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
              px: 1,
              py: 2.5,
              fontSize: "0.85rem",
              fontWeight: isActive ? 700 : 500,
              borderColor: isActive ? "transparent" : "rgba(255,255,255,0.12)",
              background: isActive
                ? "linear-gradient(135deg, #06b6d4, #a855f7)"
                : "transparent",
              color: isActive ? "#fff" : "text.secondary",
              transition: "all 0.25s ease",
              "& .MuiChip-icon": {
                color: isActive ? "#fff" : "text.secondary",
              },
              "&:hover": {
                background: isActive
                  ? "linear-gradient(135deg, #22d3ee, #c084fc)"
                  : "rgba(255,255,255,0.06)",
                borderColor: isActive ? "transparent" : "rgba(255,255,255,0.2)",
              },
            }}
          />
        );
      })}
    </Box>
  );
}
