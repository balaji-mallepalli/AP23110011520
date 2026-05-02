const VALID_STACKS = ["frontend", "backend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];

const FRONTEND_ONLY_PACKAGES = ["api", "component", "hook", "page", "state", "style"];
const BACKEND_ONLY_PACKAGES = [
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service"
];
const SHARED_PACKAGES = ["auth", "config", "middleware", "utils"];

const VALID_PACKAGES = {
  frontend: [...FRONTEND_ONLY_PACKAGES, ...SHARED_PACKAGES],
  backend:  [...BACKEND_ONLY_PACKAGES, ...SHARED_PACKAGES],
};

const LOG_ENDPOINT = "http://20.207.122.201/evaluation-service/logs";

let _bearerToken = "";

// Store the Bearer token for all subsequent Log() calls
export function setToken(token) {
  _bearerToken = token;
}

// Send a structured log entry to the remote service (never throws)
export async function Log(stack, level, pkg, message) {
  try {
    if (!VALID_STACKS.includes(stack)) return null;
    if (!VALID_LEVELS.includes(level)) return null;
    if (!VALID_PACKAGES[stack].includes(pkg)) return null;
    if (typeof message !== "string" || message.length === 0) return null;

    const body = JSON.stringify({ stack, level, package: pkg, message });
    const headers = { "Content-Type": "application/json" };

    if (_bearerToken) {
      headers["Authorization"] = `Bearer ${_bearerToken}`;
    }

    const response = await fetch(LOG_ENDPOINT, { method: "POST", headers, body });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (_error) {
    return null;
  }
}
