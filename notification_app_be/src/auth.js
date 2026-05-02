import { Log, setToken } from "logging-middleware";

const AUTH_ENDPOINT = "http://20.207.122.201/evaluation-service/auth";

const CREDENTIALS = {
  email:        "balaji_mallepalli@srmap.edu.in",
  name:         "balaji mallepalli",
  rollNo:       "ap23110011520",
  accessCode:   "QkbpxH",
  clientID:     "76ecc2af-1cba-4a00-abe0-21c142161a0a",
  clientSecret: "xcQfdntQFkkatfMc",
};

export async function authenticate() {
  Log("backend", "info", "auth", "Starting authentication");

  const response = await fetch(AUTH_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(CREDENTIALS),
  });

  if (!response.ok) {
    Log("backend", "error", "auth", `Authentication failed: HTTP ${response.status}`);
    throw new Error(`Auth failed: HTTP ${response.status}`);
  }

  const data = await response.json();
  const token = data.access_token;

  setToken(token);
  Log("backend", "info", "auth", "Authentication successful");

  return token;
}
