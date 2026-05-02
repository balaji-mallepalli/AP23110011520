import { Box, Pagination } from "@mui/material";
import { Log } from "logging-middleware";

export default function PaginationBar({ page, onPageChange, hasMore }) {
  const handleChange = (_event, value) => {
    Log("frontend", "info", "component", `Navigating to page ${value}`);
    onPageChange(value);
  };

  const estimatedCount = hasMore ? page + 1 : page;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
      <Pagination
        count={estimatedCount}
        page={page}
        onChange={handleChange}
        size="medium"
        shape="rounded"
        sx={{ "& .MuiPaginationItem-root": { fontSize: "0.85rem", minWidth: 36, height: 36, borderRadius: "6px" } }}
      />
    </Box>
  );
}
