import * as authService from "./service.js";

export const register = async (req, res) => {
  const session = await authService.register(req.body);
  res.status(201).json({ data: session });
};

export const login = async (req, res) => {
  const session = await authService.login(req.body);
  res.status(200).json({ data: session });
};