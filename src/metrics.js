import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

export default register;