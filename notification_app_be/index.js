import { Log } from "logging-middleware";
import { authenticate } from "./src/auth.js";
import { fetchAllNotifications } from "./src/fetchNotifications.js";
import { getTopPriorityNotifications } from "./src/priorityInbox.js";

const DEFAULT_TOP_N = 10;

const COLORS = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  cyan: "\x1b[36m", green: "\x1b[32m", white: "\x1b[37m",
  bgBlue: "\x1b[44m", bgMagenta: "\x1b[45m", bgGreen: "\x1b[42m", bgYellow: "\x1b[43m",
};

const TYPE_BADGES = {
  Placement: `${COLORS.bgMagenta}${COLORS.bold} PLACEMENT ${COLORS.reset}`,
  Result:    `${COLORS.bgGreen}${COLORS.bold}  RESULT   ${COLORS.reset}`,
  Event:     `${COLORS.bgYellow}${COLORS.bold}  EVENT    ${COLORS.reset}`,
};

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
  process.stdout.write(`${COLORS.green}✓ Displayed ${notifications.length} notifications ranked by priority${COLORS.reset}\n\n`);
}

async function main() {
  const topN = parseInt(process.argv[2], 10) || DEFAULT_TOP_N;

  Log("backend", "info", "handler", `Priority inbox started — top ${topN}`);

  try {
    const token = await authenticate();
    const allNotifications = await fetchAllNotifications(token);
    const topNotifications = getTopPriorityNotifications(allNotifications, topN);
    printResults(topNotifications, topN);
    Log("backend", "info", "handler", `Displayed top ${topNotifications.length} notifications`);
  } catch (error) {
    Log("backend", "fatal", "handler", `Failed: ${error.message}`);
    process.stderr.write(`\n${COLORS.bold}Error: ${error.message}${COLORS.reset}\n`);
    process.exitCode = 1;
  }
}

main();
