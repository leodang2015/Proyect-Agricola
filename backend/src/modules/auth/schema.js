import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().email().max(254).lowercase().trim().required(),
  password: Joi.string().min(8).max(128).required()
}).unknown(false);

export const loginSchema = Joi.object({
  email: Joi.string().email().max(254).lowercase().trim().required(),
  password: Joi.string().min(1).max(128).required()
}).unknown(false);