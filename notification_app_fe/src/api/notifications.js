/**
 * Notification API Module
 *
 * Handles all HTTP communication with the evaluation service API.
 * Every fetch call is wrapped with Log() calls for observability.
 */

import { Log, setToken } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  API Configuration                                                  */
/* ------------------------------------------------------------------ */

/** Base URL — proxied via Vite dev server to avoid CORS */
const BASE_URL = "/api";

/** Credentials for token acquisition */
const CREDENTIALS = {
  email:        "balaji_mallepalli@srmap.edu.in",
  name:         "balaji mallepalli",
  rollNo:       "ap23110011520",
  accessCode:   "QkbpxH",
  clientID:     "76ecc2af-1cba-4a00-abe0-21c142161a0a",
  clientSecret: "xcQfdntQFkkatfMc",
};

/* ------------------------------------------------------------------ */
/*  Module state                                                       */
/* ------------------------------------------------------------------ */

/** Cached Bearer token — refreshed when expired */
let cachedToken = "";

/** Token expiration timestamp (epoch seconds) */
let tokenExpiresAt = 0;

/* ------------------------------------------------------------------ */
/*  Auth                                                               */
/* ------------------------------------------------------------------ */

/**
 * Obtain (or re-use) a valid Bearer token from the auth endpoint.
 * Automatically refreshes if the cached token has expired.
 *
 * @returns {Promise<string>} The access_token
 */
export async function getAuthToken() {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiresAt > now + 60) {
    return cachedToken;
  }

  Log("frontend", "info", "api", "Requesting new auth token");

  try {
    const response = await fetch(`${BASE_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(CREDENTIALS),
    });

    if (!response.ok) {
      Log("frontend", "error", "api", `Auth failed: HTTP ${response.status}`);
      throw new Error(`Auth failed: HTTP ${response.status}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    tokenExpiresAt = data.expires_in;

    // Set token on the logging middleware for authenticated log calls
    setToken(cachedToken);

    Log("frontend", "info", "api", "Auth token acquired successfully");
    return cachedToken;
  } catch (error) {
    Log("frontend", "error", "api", `Auth error: ${error.message}`);
    throw error;
  }
}

/* ------------------------------------------------------------------ */
/*  Notifications                                                      */
/* ------------------------------------------------------------------ */

/**
 * Fetch a page of notifications from the evaluation service.
 *
 * @param {object} params
 * @param {number} [params.page=1]              — Page number (1-indexed)
 * @param {number} [params.limit=10]            — Items per page
 * @param {string} [params.notificationType]    — Filter: "Event"|"Result"|"Placement"
 * @returns {Promise<Array<{ID: string, Type: string, Message: string, Timestamp: string}>>}
 */
export async function fetchNotifications({ page = 1, limit = 10, notificationType } = {}) {
  Log("frontend", "info", "api", `Fetching notifications — page=${page}, limit=${limit}, type=${notificationType || "all"}`);

  try {
    const token = await getAuthToken();

    // Build query string
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (notificationType) {
      params.set("notification_type", notificationType);
    }

    const url = `${BASE_URL}/notifications?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      Log("frontend", "error", "api", `Failed to fetch notifications: HTTP ${response.status}`);
      throw new Error(`Fetch failed: HTTP ${response.status}`);
    }

    const data = await response.json();
    const notifications = data.notifications || [];

    Log("frontend", "info", "api", `Fetched ${notifications.length} notifications (page ${page})`);
    return notifications;
  } catch (error) {
    Log("frontend", "error", "api", `Notification fetch error: ${error.message}`);
    throw error;
  }
}

/**
 * Fetch ALL notifications by paginating through every available page.
 * Used by the Priority Inbox to rank the complete dataset.
 *
 * @returns {Promise<Array<{ID: string, Type: string, Message: string, Timestamp: string}>>}
 */
export async function fetchAllNotifications() {
  Log("frontend", "info", "api", "Fetching ALL notifications for priority ranking");

  const allNotifications = [];
  let currentPage = 1;
  const pageSize = 10;
  let hasMore = true;

  while (hasMore && currentPage <= 50) {
    const pageData = await fetchNotifications({ page: currentPage, limit: pageSize });
    allNotifications.push(...pageData);

    if (pageData.length < pageSize) {
      hasMore = false;
    } else {
      currentPage += 1;
    }
  }

  Log("frontend", "info", "api", `Total notifications fetched: ${allNotifications.length}`);
  return allNotifications;
}
