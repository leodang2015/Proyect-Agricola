import * as userService from "./service.js";

export const getProfile = async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  res.status(200).json({ data: user });
};

export const updateProfile = async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  res.status(200).json({ data: user });
};