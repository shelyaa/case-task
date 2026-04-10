import express from "express";
import subscriptionRoutes from "./routes/subscriptions.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  }),
);

app.use(express.json());

app.use("/api", subscriptionRoutes);

export default app;
