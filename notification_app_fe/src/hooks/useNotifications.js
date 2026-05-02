import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log } from "logging-middleware";

export function useNotifications({ initialPage = 1, limit = 10, notificationType: initialType = null } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [notificationType, setNotificationType] = useState(initialType);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    Log("frontend", "info", "hook", `useNotifications fetching — page=${page}, type=${notificationType || "all"}`);

    try {
      const data = await fetchNotifications({
        page,
        limit,
        notificationType: notificationType || undefined,
      });
      setNotifications(data);
      setHasMore(data.length >= limit);
      Log("frontend", "info", "hook", `Loaded ${data.length} notifications`);
    } catch (err) {
      setError(err.message);
      Log("frontend", "error", "hook", `useNotifications error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [page, limit, notificationType]);

  useEffect(() => { fetchData(); }, [fetchData]);

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
    notifications, loading, error, page,
    setPage: handleSetPage,
    notificationType,
    setNotificationType: handleSetNotificationType,
    refetch: fetchData, hasMore,
  };
}
