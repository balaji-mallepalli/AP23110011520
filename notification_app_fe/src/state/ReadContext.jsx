import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Log } from "logging-middleware";

const STORAGE_KEY = "campus_notifications_read_ids";

function loadReadIds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch (_error) { /* start fresh */ }
  return new Set();
}

function saveReadIds(readIds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...readIds]));
  } catch (_error) {
    Log("frontend", "error", "state", "Failed to persist read IDs");
  }
}

const ReadContext = createContext(null);

export function ReadProvider({ children }) {
  const [readIds, setReadIds] = useState(() => loadReadIds());

  const markRead = useCallback((id) => {
    Log("frontend", "debug", "state", `Marking notification ${id} as read`);
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const isRead = useCallback((id) => readIds.has(id), [readIds]);

  const contextValue = useMemo(
    () => ({ readIds, markRead, isRead }),
    [readIds, markRead, isRead]
  );

  return (
    <ReadContext.Provider value={contextValue}>
      {children}
    </ReadContext.Provider>
  );
}

export function useReadContext() {
  const context = useContext(ReadContext);
  if (!context) throw new Error("useReadContext must be used within a ReadProvider");
  return context;
}
