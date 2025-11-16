import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    // lightweight console logger for startup
    console.log(
      `Server listening on http://localhost:${PORT} (env: ${process.env.NODE_ENV || "development"})`,
    );
  });
});
