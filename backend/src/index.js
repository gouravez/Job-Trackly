// backend/src/index.js
import "dotenv/config";
import app from "./app.js";
import { ENV } from "./config/env.js";
import { testConnection } from "./lib/db.js";
import { runFollowUpReminders } from "./jobs/followUpReminder.js";
import { cleanupExpiredCodes } from "./lib/oauthCodes.js"; 

function scheduleReminders() {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  async function run() {
    try {
      await runFollowUpReminders();
      await cleanupExpiredCodes();
    } catch (err) {
      console.error("[reminder] Uncaught error in scheduler:", err);
    }
    setTimeout(run, MS_PER_DAY);
  }

  setTimeout(run, 10_000);
  console.log(
    "⏰  Reminder scheduler armed (first run in 10 s, then every 24 h)",
  );
}

async function start() {
  await testConnection();

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
    console.log(`   Environment : ${ENV.NODE_ENV}`);
    console.log(`   CORS origin : ${ENV.CLIENT_URL}`);
  });

  scheduleReminders(); 
}

start();