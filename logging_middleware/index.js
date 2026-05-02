/**
 * Logging Middleware
 *
 * A reusable module that provides structured remote logging for the
 * campus notification system. All logs are sent to a central evaluation
 * service via POST requests. This module is designed to never throw
 * or crash the host application, even if the remote API is unreachable.
 *
 * Exports:
 *   - setToken(token)            — store the Bearer token for API auth
 *   - Log(stack, level, pkg, message) — send a structured log entry
 */

/* ------------------------------------------------------------------ */
/*  Valid enum values for log parameters                               */
/* ------------------------------------------------------------------ */

/** Allowed values for the "stack" parameter */
const VALID_STACKS = ["frontend", "backend"];

/** Allowed values for the "level" parameter */
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];

/** Package names that are valid only for the frontend stack */
const FRONTEND_ONLY_PACKAGES = ["api", "component", "hook", "page", "state", "style"];

/** Package names that are valid only for the backend stack */
const BACKEND_ONLY_PACKAGES = [
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service"
];

/** Package names that are valid for both stacks */
const SHARED_PACKAGES = ["auth", "config", "middleware", "utils"];

/** Combined lookup of allowed packages per stack */
const VALID_PACKAGES = {
  frontend: [...FRONTEND_ONLY_PACKAGES, ...SHARED_PACKAGES],
  backend:  [...BACKEND_ONLY_PACKAGES, ...SHARED_PACKAGES],
};

/* ------------------------------------------------------------------ */
/*  Endpoint configuration                                             */
/* ------------------------------------------------------------------ */

const LOG_ENDPOINT = "http://20.207.122.201/evaluation-service/logs";

/* ------------------------------------------------------------------ */
/*  Module-level state                                                 */
/* ------------------------------------------------------------------ */

/** Bearer token stored after calling setToken() */
let _bearerToken = "";

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Store the Bearer token that will be used in Authorization headers
 * for all subsequent Log() calls.
 *
 * @param {string} token — The access_token value from the auth response
 */
export function setToken(token) {
  _bearerToken = token;
}

/**
 * Send a structured log entry to the remote evaluation service.
 *
 * This function is intentionally "fire-and-forget" — it will never
 * throw an error or reject a promise, so it is safe to call from
 * any part of the application without try/catch.
 *
 * @param {("frontend"|"backend")} stack   — Which stack is logging
 * @param {("debug"|"info"|"warn"|"error"|"fatal")} level — Severity
 * @param {string} pkg     — The package/module category (e.g. "api", "handler")
 * @param {string} message — Human-readable log message
 * @returns {Promise<{logID: string, message: string} | null>}
 */
export async function Log(stack, level, pkg, message) {
  try {
    /* ---------- Parameter validation ---------- */

    if (!VALID_STACKS.includes(stack)) {
      // Silently ignore invalid stacks — never crash the app
      return null;
    }

    if (!VALID_LEVELS.includes(level)) {
      return null;
    }

    if (!VALID_PACKAGES[stack].includes(pkg)) {
      return null;
    }

    if (typeof message !== "string" || message.length === 0) {
      return null;
    }

    /* ---------- Build request ---------- */

    const body = JSON.stringify({
      stack,
      level,
      package: pkg,
      message,
    });

    const headers = {
      "Content-Type": "application/json",
    };

    // Attach Bearer token if available
    if (_bearerToken) {
      headers["Authorization"] = `Bearer ${_bearerToken}`;
    }

    /* ---------- Fire the POST request ---------- */

    const response = await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers,
      body,
    });

    if (response.ok) {
      const data = await response.json();
      // data shape: { logID: "<uuid>", message: "log created successfully" }
      return data;
    }

    // Non-200 response — return null silently
    return null;
  } catch (_error) {
    // Network failure, CORS, or any other exception — swallow silently
    // so the host application is never affected by logging issues
    return null;
  }
}
