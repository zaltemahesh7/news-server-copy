import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

// middleware
app.use(cors({ origin: "*" }));
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
