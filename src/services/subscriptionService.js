import {v4 as uuidv4} from "uuid";
import axios from "axios";
import {pool} from "../db/db.js";

export const createSubscription = async (email, repo) => {
  const repoRegex = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
  if (!repoRegex.test(repo)) {
    const error = new Error("Invalid repo format");
    error.status = 400;
    throw error;
  }

  try {
    await axios.get(`https://api.github.com/repos/${repo}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });
  } catch (err) {
    if (err.response?.status === 404) {
      const error = new Error("Repository not found");
      error.status = 404;
      throw error;
    }
    if (err.response?.status === 429) {
      const error = new Error("GitHub API rate limit exceeded");
      error.status = 429;
      throw error;
    }
    throw err;
  }

  const confirmToken = uuidv4();
  const unsubscribeToken = uuidv4();

  await pool.query(
    `INSERT INTO subscriptions (email, repo, confirm_token, unsubscribe_token)
     VALUES ($1, $2, $3, $4)`,
    [email, repo, confirmToken, unsubscribeToken],
  );

  return {confirmToken, unsubscribeToken};
};

export const confirmSubscription = async (token) => {
  const result = await pool.query(
    `SELECT * FROM subscriptions WHERE confirm_token = $1`,
    [token],
  );

  if (result.rows.length === 0) {
    const error = new Error("Token not found");
    error.status = 404;
    throw error;
  }

  await pool.query(
    `UPDATE subscriptions SET confirmed = true WHERE confirm_token = $1`,
    [token],
  );
};

export const unsubscribeSubscription = async (token) => {
  const result = await pool.query(
    `SELECT * FROM subscriptions WHERE unsubscribe_token = $1`,
    [token],
  );

  if (result.rows.length === 0) {
    const error = new Error("Token not found");
    error.status = 404;
    throw error;
  }

  await pool.query(`DELETE FROM subscriptions WHERE unsubscribe_token = $1`, [
    token,
  ]);
};

export const getSubscriptionsByEmail = async (email) => {
  const result = await pool.query(
    `SELECT id, email, repo, created_at, unsubscribe_token
     FROM subscriptions 
     WHERE email = $1 AND confirmed = true`,
    [email],
  );

  return result.rows;
};
