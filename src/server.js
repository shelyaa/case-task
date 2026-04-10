import app from "./app.js";
import {migrate} from "./db/migrations.js";
import { startScanner } from "./services/scannerService.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  await migrate();
  startScanner();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
