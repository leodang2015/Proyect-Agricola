import { User } from "./model.js";

const publicFields = "name email role active createdAt updatedAt";

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select(publicFields).lean();
  if (!user || !user.active) {
    const error = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  return user;
};

export const updateProfile = async (userId, data) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, active: true },
    { $set: data },
    { new: true, runValidators: true }
  )
    .select(publicFields)
    .lean();
  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  return user;
};