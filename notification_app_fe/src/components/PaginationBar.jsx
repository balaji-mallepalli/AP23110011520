/**
 * PaginationBar Component
 *
 * Wraps MUI's Pagination component with custom styling and logging.
 * Appears below the notification grid to navigate between pages.
 */

import { Box, Pagination } from "@mui/material";
import { Log } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * @param {{
 *   page: number,
 *   onPageChange: (newPage: number) => void,
 *   hasMore: boolean,
 * }} props
 */
export default function PaginationBar({ page, onPageChange, hasMore }) {
  /**
   * Handle page change from MUI Pagination.
   * MUI passes (event, value) — we only need value.
   */
  const handleChange = (_event, value) => {
    Log("frontend", "info", "component", `PaginationBar: navigating to page ${value}`);
    onPageChange(value);
  };

  /**
   * We don't know the exact total page count from the API,
   * so we use the current page + 1 if hasMore is true,
   * otherwise cap at the current page.
   */
  const estimatedCount = hasMore ? page + 1 : page;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        mb: 2,
      }}
    >
      <Pagination
        count={estimatedCount}
        page={page}
        onChange={handleChange}
        size="large"
        shape="rounded"
        sx={{
          "& .MuiPaginationItem-root": {
            fontSize: "0.95rem",
            minWidth: 40,
            height: 40,
          },
        }}
      />
    </Box>
  );
}
