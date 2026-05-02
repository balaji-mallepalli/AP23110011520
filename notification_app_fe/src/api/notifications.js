import { Log, setToken } from "logging-middleware";

const BASE_URL = "/api";

const CREDENTIALS = {
  email:        "balaji_mallepalli@srmap.edu.in",
  name:         "balaji mallepalli",
  rollNo:       "ap23110011520",
  accessCode:   "QkbpxH",
  clientID:     "76ecc2af-1cba-4a00-abe0-21c142161a0a",
  clientSecret: "xcQfdntQFkkatfMc",
};

let cachedToken = "";
let tokenExpiresAt = 0;

export async function getAuthToken() {
  const now = Math.floor(Date.now() / 1000);

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
    setToken(cachedToken);

    Log("frontend", "info", "api", "Auth token acquired");
    return cachedToken;
  } catch (error) {
    Log("frontend", "error", "api", `Auth error: ${error.message}`);
    throw error;
  }
}

// Fetch notifications with retry logic for transient 502/503/504 errors
export async function fetchNotifications({ page = 1, limit = 10, notificationType } = {}) {
  Log("frontend", "info", "api", `Fetching notifications — page=${page}, limit=${limit}, type=${notificationType || "all"}`);

  const MAX_RETRIES = 3;
  const RETRY_STATUSES = [502, 503, 504];

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const token = await getAuthToken();

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

      if (RETRY_STATUSES.includes(response.status) && attempt < MAX_RETRIES) {
        const delayMs = 500 * Math.pow(2, attempt - 1);
        Log("frontend", "warn", "api", `HTTP ${response.status} — retrying in ${delayMs}ms`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      if (!response.ok) {
        Log("frontend", "error", "api", `Failed to fetch: HTTP ${response.status}`);
        throw new Error(`Fetch failed: HTTP ${response.status}`);
      }

      const data = await response.json();
      const notifications = data.notifications || [];

      Log("frontend", "info", "api", `Fetched ${notifications.length} notifications (page ${page})`);
      return notifications;
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        Log("frontend", "error", "api", `Fetch error after ${MAX_RETRIES} attempts: ${error.message}`);
        throw error;
      }
      const delayMs = 500 * Math.pow(2, attempt - 1);
      Log("frontend", "warn", "api", `Attempt ${attempt} failed — retrying in ${delayMs}ms`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

// Fetch ALL notifications by paginating through every page
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
