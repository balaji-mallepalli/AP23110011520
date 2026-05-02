/**
 * Fetch Notifications Module
 *
 * Retrieves all notifications from the evaluation service API,
 * handling pagination automatically. Returns the complete list
 * of notification objects.
 */

import { Log } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const NOTIFICATIONS_ENDPOINT = "http://20.207.122.201/evaluation-service/notifications";

/** Maximum notifications to fetch per page (API accepts up to 10) */
const PAGE_SIZE = 10;

/** Safety limit to prevent infinite pagination loops */
const MAX_PAGES = 50;

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Fetch all notifications from the evaluation service.
 * Paginates automatically until no more results are returned.
 *
 * @param {string} token — Bearer access token
 * @returns {Promise<Array<{ID: string, Type: string, Message: string, Timestamp: string}>>}
 */
export async function fetchAllNotifications(token) {
  Log("backend", "info", "service", "Starting notification fetch from evaluation service");

  const allNotifications = [];
  let currentPage = 1;
  let hasMore = true;

  while (hasMore && currentPage <= MAX_PAGES) {
    Log("backend", "debug", "service", `Fetching page ${currentPage} (limit=${PAGE_SIZE})`);

    const url = `${NOTIFICATIONS_ENDPOINT}?limit=${PAGE_SIZE}&page=${currentPage}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      Log("backend", "error", "service", `Fetch failed on page ${currentPage}: HTTP ${response.status}`);
      throw new Error(`Notification fetch failed: HTTP ${response.status}`);
    }

    const data = await response.json();
    const pageNotifications = data.notifications || [];

    allNotifications.push(...pageNotifications);

    Log(
      "backend", "debug", "service",
      `Page ${currentPage} returned ${pageNotifications.length} notifications`
    );

    // If we got fewer results than the page size, we've reached the end
    if (pageNotifications.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      currentPage += 1;
    }
  }

  Log(
    "backend", "info", "service",
    `Fetch complete — ${allNotifications.length} total notifications retrieved`
  );

  return allNotifications;
}
