/**
 * Notification Backend — Entry Point
 *
 * CLI script that:
 *   1. Authenticates with the evaluation service
 *   2. Fetches all campus notifications
 *   3. Ranks them using the priority inbox algorithm (Min-Heap)
 *   4. Prints the top N most important notifications
 *
 * Usage:
 *   node index.js          — prints top 10 (default)
 *   node index.js 15       — prints top 15
 *   node index.js 20       — prints top 20
 */

import { Log } from "logging-middleware";
import { authenticate } from "./src/auth.js";
import { fetchAllNotifications } from "./src/fetchNotifications.js";
import { getTopPriorityNotifications } from "./src/priorityInbox.js";

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

/** Default number of top notifications to display */
const DEFAULT_TOP_N = 10;

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                 */
/* ------------------------------------------------------------------ */

/** ANSI colour codes for terminal output */
const COLORS = {
  reset:     "\x1b[0m",
  bold:      "\x1b[1m",
  dim:       "\x1b[2m",
  cyan:      "\x1b[36m",
  green:     "\x1b[32m",
  yellow:    "\x1b[33m",
  magenta:   "\x1b[35m",
  white:     "\x1b[37m",
  bgBlue:    "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgGreen:   "\x1b[42m",
  bgYellow:  "\x1b[43m",
};

/** Map notification type to a coloured badge for CLI output */
const TYPE_BADGES = {
  Placement: `${COLORS.bgMagenta}${COLORS.bold} PLACEMENT ${COLORS.reset}`,
  Result:    `${COLORS.bgGreen}${COLORS.bold}  RESULT   ${COLORS.reset}`,
  Event:     `${COLORS.bgYellow}${COLORS.bold}  EVENT    ${COLORS.reset}`,
};

/**
 * Pretty-print a ranked list of notifications to the terminal.
 *
 * @param {Array<{ID: string, Type: string, Message: string, Timestamp: string}>} notifications
 * @param {number} topN — The N that was requested
 */
function printResults(notifications, topN) {
  const divider = `${COLORS.dim}${"─".repeat(70)}${COLORS.reset}`;

  process.stdout.write("\n");
  process.stdout.write(`${COLORS.bgBlue}${COLORS.bold}  🔔 TOP ${topN} PRIORITY NOTIFICATIONS  ${COLORS.reset}\n`);
  process.stdout.write(`${divider}\n`);

  notifications.forEach((notification, index) => {
    const rank = `${COLORS.bold}${COLORS.cyan}#${String(index + 1).padStart(2, "0")}${COLORS.reset}`;
    const badge = TYPE_BADGES[notification.Type] || notification.Type;
    const message = `${COLORS.white}${notification.Message}${COLORS.reset}`;
    const timestamp = `${COLORS.dim}${notification.Timestamp}${COLORS.reset}`;
    const id = `${COLORS.dim}ID: ${notification.ID}${COLORS.reset}`;

    process.stdout.write(`\n ${rank}  ${badge}  ${message}\n`);
    process.stdout.write(`       ${timestamp}  ${id}\n`);
  });

  process.stdout.write(`\n${divider}\n`);
  process.stdout.write(
    `${COLORS.green}✓ Displayed ${notifications.length} notifications ranked by priority${COLORS.reset}\n\n`
  );
}

/* ------------------------------------------------------------------ */
/*  Main execution flow                                                */
/* ------------------------------------------------------------------ */

async function main() {
  // Parse the optional topN argument from CLI (default 10)
  const topN = parseInt(process.argv[2], 10) || DEFAULT_TOP_N;

  Log("backend", "info", "handler", `Priority inbox started — requesting top ${topN} notifications`);

  try {
    // Step 1: Authenticate
    const token = await authenticate();

    // Step 2: Fetch all notifications from the API
    const allNotifications = await fetchAllNotifications(token);

    // Step 3: Rank and extract the top N using the priority algorithm
    const topNotifications = getTopPriorityNotifications(allNotifications, topN);

    // Step 4: Display results
    printResults(topNotifications, topN);

    Log(
      "backend", "info", "handler",
      `Priority inbox complete — displayed top ${topNotifications.length} notifications`
    );
  } catch (error) {
    Log("backend", "fatal", "handler", `Priority inbox failed: ${error.message}`);
    process.stderr.write(`\n${COLORS.bold}Error: ${error.message}${COLORS.reset}\n`);
    process.exitCode = 1;
  }
}

main();
