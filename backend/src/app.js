import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((_req, _res, next) => {
  const error = new Error("Ruta no encontrada");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

export default app;
