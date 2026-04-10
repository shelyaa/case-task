import {pool} from "./db.js";

export const migrate = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      repo VARCHAR(255) NOT NULL,
      confirmed BOOLEAN DEFAULT FALSE,
      confirm_token VARCHAR(255) UNIQUE NOT NULL,
      unsubscribe_token VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS repositories (
      id SERIAL PRIMARY KEY,
      repo VARCHAR(255) UNIQUE NOT NULL,
      last_seen_tag VARCHAR(255),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
};
