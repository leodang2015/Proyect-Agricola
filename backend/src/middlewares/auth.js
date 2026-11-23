import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const authenticate = (req, _res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    const error = new Error("Se requiere autenticación");
    error.status = 401;
    return next(error);
  }

  try {
    const payload = jwt.verify(authorization.slice(7), config.jwtSecret);
    if (typeof payload === "string" || !payload.sub) {
      const error = new Error("Token inválido");
      error.status = 401;
      return next(error);
    }

    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (error) {
    error.status = 401;
    error.message = "Token inválido o expirado";
    return next(error);
  }
};