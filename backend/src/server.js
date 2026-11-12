import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";
import app from "./app.js";

const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto ${config.port}`);
  });
};

startServer().catch((error) => {
  console.error("No se pudo iniciar el servidor:", error);
  process.exitCode = 1;
});
