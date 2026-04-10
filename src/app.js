import express from "express";
import subscriptionRoutes from "./routes/subscriptions.js";

const app = express();
app.use(express.json());

app.use("/api", subscriptionRoutes);

export default app;