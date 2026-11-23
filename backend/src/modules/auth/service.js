import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";
import { User } from "../usuarios/model.js";

const scrypt = promisify(scryptCallback);

const hashPassword = async (password) => {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
};

const passwordMatches = async (password, passwordHash) => {
  const [salt, storedHash] = passwordHash.split(":");
  if (!salt || !storedHash) {
    return false;
  }

  const expected = Buffer.from(storedHash, "hex");
  if (expected.length === 0) {
    return false;
  }

  const actual = await scrypt(password, salt, expected.length);
  return timingSafeEqual(expected, actual);
};

const createSession = (user) => ({
  accessToken: jwt.sign(
    { role: user.role },
    config.jwtSecret,
    { subject: user.id, expiresIn: "8h" }
  ),
  tokenType: "Bearer",
  expiresIn: 28800,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});

export const register = async ({ name, email, password }) => {
  const user = await User.create({
    name,
    email,
    passwordHash: await hashPassword(password)
  });
  return createSession(user);
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email, active: true }).select("+passwordHash");
  if (!user || !(await passwordMatches(password, user.passwordHash))) {
    const error = new Error("Correo o contraseña incorrectos");
    error.status = 401;
    throw error;
  }

  return createSession(user);
};