import cron from "node-cron";
import axios from "axios";
import {pool} from "../db/db.js";
import {sendReleaseNotification} from "./emailService.js";

export const checkReleases = async () => {
  const {rows: repos} = await pool.query(
    `SELECT DISTINCT repo FROM subscriptions WHERE confirmed = true`,
  );

  for (const {repo} of repos) {
    try {
      const {data} = await axios.get(
        `https://api.github.com/repos/${repo}/releases/latest`,
      );
      const latestTag = data.tag_name;

      const {rows} = await pool.query(
        `SELECT last_seen_tag FROM repositories WHERE repo = $1`,
        [repo],
      );

      const lastSeenTag = rows[0]?.last_seen_tag;

      if (lastSeenTag !== latestTag) {
        const {rows: subscribers} = await pool.query(
          `SELECT email FROM subscriptions WHERE repo = $1 AND confirmed = true`,
          [repo],
        );

        for (const {email} of subscribers) {
          await sendReleaseNotification(email, repo, latestTag);
        }

        await pool.query(
          `INSERT INTO repositories (repo, last_seen_tag, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (repo) DO UPDATE 
           SET last_seen_tag = $2, updated_at = NOW()`,
          [repo, latestTag],
        );
      }
    } catch (err) {}
  }
};

export const startScanner = () => {
  cron.schedule("* * * * *", checkReleases);
};
