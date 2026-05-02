import { Log } from "logging-middleware";

const NOTIFICATIONS_ENDPOINT = "http://20.207.122.201/evaluation-service/notifications";
const PAGE_SIZE = 10;
const MAX_PAGES = 50;

export async function fetchAllNotifications(token) {
  Log("backend", "info", "service", "Starting notification fetch");

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

    Log("backend", "debug", "service", `Page ${currentPage}: ${pageNotifications.length} notifications`);

    if (pageNotifications.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      currentPage += 1;
    }
  }

  Log("backend", "info", "service", `Fetch complete — ${allNotifications.length} total`);
  return allNotifications;
}
