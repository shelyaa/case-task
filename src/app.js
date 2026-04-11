import express from "express";
import subscriptionRoutes from "./routes/subscriptions.js";
import cors from "cors";
import register, { httpRequestCounter } from "./metrics.js";

const app = express();

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
  });
  next();
});

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());
app.use("/api", subscriptionRoutes);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export default app;