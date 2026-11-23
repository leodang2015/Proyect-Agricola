import Joi from "joi";

export const schemas = {
  create: Joi.object({
    sowingId: Joi.string().hex().length(24).required(),
    eventType: Joi.string()
      .valid("observacion", "tratamiento", "riego", "otro")
      .required(),
    occurredAt: Joi.date().iso().required(),
    description: Joi.string().trim().min(2).max(1000).required(),
    inputs: Joi.array()
      .items(Joi.string().trim().min(1).max(120))
      .max(50)
      .default([])
  }).unknown(false),
  update: Joi.object({
    eventType: Joi.string().valid("observacion", "tratamiento", "riego", "otro"),
    occurredAt: Joi.date().iso(),
    description: Joi.string().trim().min(2).max(1000),
    inputs: Joi.array()
      .items(Joi.string().trim().min(1).max(120))
      .max(50)
  })
    .min(1)
    .unknown(false)
};
