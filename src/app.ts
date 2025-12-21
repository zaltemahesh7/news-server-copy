import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["https://www.dhairyasiddhinews24.in", "https://dhairyasiddhinews24.in"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(express.json());

// routes
import routes from "./components/routes";
app.use("/api/v1", routes);

app.get("/", (_req, res) =>
  res.status(200).json({ status: "ok", message: "Welcome to News API, Use /v1" }),
);

// generic 404
// app.use((_req, res) => res.status(404).json({ message: "Not Found" }));

export default app;
