/**
 * Read/Unread Notification Context
 *
 * Provides a React Context that tracks which notification IDs have
 * been "read" by the user. Read state is persisted to localStorage
 * so it survives page refreshes. No database required.
 */

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Log } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  localStorage key                                                   */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "campus_notifications_read_ids";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Load the set of read notification IDs from localStorage.
 * Returns an empty Set if nothing is stored or if parsing fails.
 *
 * @returns {Set<string>}
 */
function loadReadIds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Set(parsed);
    }
  } catch (_error) {
    // Corrupted data — start fresh
  }
  return new Set();
}

/**
 * Persist the set of read IDs to localStorage.
 *
 * @param {Set<string>} readIds
 */
function saveReadIds(readIds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...readIds]));
  } catch (_error) {
    Log("frontend", "error", "state", "Failed to persist read IDs to localStorage");
  }
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

/**
 * @typedef {object} ReadContextValue
 * @property {Set<string>} readIds           — Set of read notification IDs
 * @property {(id: string) => void} markRead — Mark a single notification as read
 * @property {(id: string) => boolean} isRead — Check if a notification is read
 */

const ReadContext = createContext(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

/**
 * ReadProvider wraps the application and provides read/unread tracking
 * to all child components via React Context.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function ReadProvider({ children }) {
  const [readIds, setReadIds] = useState(() => loadReadIds());

  /** Mark a single notification ID as read */
  const markRead = useCallback((id) => {
    Log("frontend", "debug", "state", `Marking notification ${id} as read`);

    setReadIds((prev) => {
      // Skip if already read
      if (prev.has(id)) return prev;

      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  /** Check whether a notification ID has been read */
  const isRead = useCallback(
    (id) => readIds.has(id),
    [readIds]
  );

  /** Memoised context value to prevent unnecessary re-renders */
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

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

/**
 * Custom hook to access the read/unread context.
 * Must be used within a <ReadProvider>.
 *
 * @returns {ReadContextValue}
 */
export function useReadContext() {
  const context = useContext(ReadContext);
  if (!context) {
    throw new Error("useReadContext must be used within a ReadProvider");
  }
  return context;
}
