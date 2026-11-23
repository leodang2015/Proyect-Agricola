import "dotenv/config";

const { MONGODB_URI, JWT_SECRET } = process.env;
const port = Number(process.env.PORT ?? 3000);

if (!MONGODB_URI) {
  throw new Error("Falta configurar MONGODB_URI en el archivo .env");
}

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET debe tener al menos 32 caracteres");
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT debe ser un número entre 1 y 65535");
}

export const config = Object.freeze({
  port,
  mongodbUri: MONGODB_URI,
  jwtSecret: JWT_SECRET
});
