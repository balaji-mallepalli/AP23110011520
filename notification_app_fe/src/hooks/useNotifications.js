/**
 * useNotifications Hook
 *
 * Manages paginated notification fetching with optional type filtering.
 * Provides loading, error, and data states for the All Notifications page.
 */

import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log } from "logging-middleware";

/**
 * Custom hook for fetching paginated, filterable notifications.
 *
 * @param {object} options
 * @param {number} [options.initialPage=1]           — Starting page
 * @param {number} [options.limit=10]                — Items per page
 * @param {string|null} [options.notificationType]   — Type filter
 * @returns {{
 *   notifications: Array,
 *   loading: boolean,
 *   error: string|null,
 *   page: number,
 *   setPage: Function,
 *   notificationType: string|null,
 *   setNotificationType: Function,
 *   refetch: Function,
 *   hasMore: boolean,
 * }}
 */
export function useNotifications({
  initialPage = 1,
  limit = 10,
  notificationType: initialType = null,
} = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [notificationType, setNotificationType] = useState(initialType);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Fetch notifications for the current page and filter settings.
   * Called automatically when page or notificationType changes.
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    Log(
      "frontend", "info", "hook",
      `useNotifications fetching — page=${page}, type=${notificationType || "all"}`
    );

    try {
      const data = await fetchNotifications({
        page,
        limit,
        notificationType: notificationType || undefined,
      });

      setNotifications(data);
      setHasMore(data.length >= limit);

      Log("frontend", "info", "hook", `useNotifications loaded ${data.length} notifications`);
    } catch (err) {
      setError(err.message);
      Log("frontend", "error", "hook", `useNotifications error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [page, limit, notificationType]);

  // Re-fetch whenever page or filter changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when the type filter changes
  const handleSetNotificationType = useCallback((type) => {
    Log("frontend", "info", "hook", `Filter changed to: ${type || "all"}`);
    setNotificationType(type);
    setPage(1);
  }, []);

  const handleSetPage = useCallback((newPage) => {
    Log("frontend", "info", "hook", `Page changed to: ${newPage}`);
    setPage(newPage);
  }, []);

  return {
    notifications,
    loading,
    error,
    page,
    setPage: handleSetPage,
    notificationType,
    setNotificationType: handleSetNotificationType,
    refetch: fetchData,
    hasMore,
  };
}
