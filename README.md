# GitHub Release Subscription Service

Subscribe to GitHub repository releases and get email notifications when a new release is published.

**Demo:** 

[backend](https://case-task-9kv7.onrender.com) 

[frontend](https://case-task.vercel.app)

> ⚠️ Backend is on Render's free tier and may sleep - if no response, retry once or twice.

---

## Getting Started

1. Clone the repo:
```bash
   git clone https://github.com/shelyaa/case-task.git
   cd case-task
```

2. Create `.env` in the root and in `frontend/` (see `.env.example`).

3. Start the backend + database:
```bash
   docker compose up --build
```
   Backend: `http://localhost:3001`, PostgreSQL on port `5431`.

4. Start the frontend:
```bash
   cd frontend
   npm install
   npm run dev
```
   Frontend: `http://localhost:3000`

---

## API Key Setup

Generate a random UUID at [uuidgenerator.net](https://www.uuidgenerator.net/) and set it in both env files:

```env
# backend .env
API_KEY=your-uuid-here

# frontend .env
NEXT_PUBLIC_API_KEY=your-uuid-here
```

Both values must match. This is a simplified static key for the scope of this task. In production each user would have their own key stored hashed in the database.

---

## How It Works

Users subscribe with an email and a repository name (`owner/repo`). The service verifies the repo exists via GitHub API, stores the subscription, and sends a confirmation email. Once confirmed, a background scanner periodically checks for new releases — if a new tag is detected, an email notification is sent.

---

## Stack

Node.js, Express, PostgreSQL, Next.js

---

## Features

- REST API matching the provided Swagger spec
- Monolithic architecture: API, Scanner, Notifier in one service
- PostgreSQL with automatic migrations on startup
- Periodic release scanning with `last_seen_tag` tracking
- Email notifications via Resend
- GitHub API rate limit handling (429)
- Dockerized with `Dockerfile` and `docker-compose.yml`
- Unit tests for business logic

### Extra
- Deployed frontend with subscription page
- Prometheus metrics at `/metrics`
- API key authentication on endpoints
- GitHub Actions CI: lint + tests on every push
