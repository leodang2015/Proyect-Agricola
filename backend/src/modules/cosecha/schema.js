import Joi from "joi";

const fields = {
  sowingId: Joi.string().hex().length(24),
  harvestedAt: Joi.date().iso(),
  quantity: Joi.number().positive(),
  unit: Joi.string().trim().min(1).max(30),
  quality: Joi.string().trim().max(80).allow(""),
  notes: Joi.string().trim().max(1000).allow("")
};

export const schemas = {
  create: Joi.object({
    ...fields,
    sowingId: fields.sowingId.required(),
    harvestedAt: fields.harvestedAt.required(),
    quantity: fields.quantity.required(),
    unit: fields.unit.required()
  }).unknown(false),
  update: Joi.object(fields).min(1).unknown(false)
};
