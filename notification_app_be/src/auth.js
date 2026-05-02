/**
 * Auth Module
 *
 * Handles authentication with the evaluation service API.
 * Obtains a Bearer token and sets it on the logging middleware
 * so all subsequent Log() calls are authenticated.
 */

import { Log, setToken } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  Configuration — credentials for the evaluation service            */
/* ------------------------------------------------------------------ */

const AUTH_ENDPOINT = "http://20.207.122.201/evaluation-service/auth";

const CREDENTIALS = {
  email:        "balaji_mallepalli@srmap.edu.in",
  name:         "balaji mallepalli",
  rollNo:       "ap23110011520",
  accessCode:   "QkbpxH",
  clientID:     "76ecc2af-1cba-4a00-abe0-21c142161a0a",
  clientSecret: "xcQfdntQFkkatfMc",
};

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Authenticate with the evaluation service and return the Bearer token.
 * Also sets the token on the logging middleware for future Log() calls.
 *
 * @returns {Promise<string>} The access_token string
 * @throws {Error} If authentication fails
 */
export async function authenticate() {
  Log("backend", "info", "auth", "Starting authentication with evaluation service");

  const response = await fetch(AUTH_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(CREDENTIALS),
  });

  if (!response.ok) {
    Log("backend", "error", "auth", `Authentication failed with status ${response.status}`);
    throw new Error(`Auth failed: HTTP ${response.status}`);
  }

  const data = await response.json();
  const token = data.access_token;

  // Set the token on the logging middleware so all future logs are authenticated
  setToken(token);

  Log("backend", "info", "auth", "Authentication successful — token acquired");

  return token;
}
