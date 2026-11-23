import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/routes.js";
import userRoutes from "./modules/usuarios/routes.js";
import terrainRoutes from "./modules/terrenos/routes.js";
import cropRoutes from "./modules/cultivos/routes.js";
import sowingRoutes from "./modules/siembras/routes.js";
import harvestRoutes from "./modules/cosecha/routes.js";
import inventoryRoutes from "./modules/inventario/routes.js";
import costRoutes from "./modules/costos/routes.js";
import reportRoutes from "./modules/reportes/routes.js";
import traceabilityRoutes from "./modules/trazabilidad/routes.js";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/terrenos", terrainRoutes);
app.use("/api/cultivos", cropRoutes);
app.use("/api/siembras", sowingRoutes);
app.use("/api/cosechas", harvestRoutes);
app.use("/api/inventario", inventoryRoutes);
app.use("/api/costos", costRoutes);
app.use("/api/reportes", reportRoutes);
app.use("/api/trazabilidad", traceabilityRoutes);

app.use((_req, _res, next) => {
  const error = new Error("Ruta no encontrada");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

export default app;
