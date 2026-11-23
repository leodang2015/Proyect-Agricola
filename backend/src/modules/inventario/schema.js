import Joi from "joi";

const fields = {
  name: Joi.string().trim().min(2).max(120),
  category: Joi.string().trim().min(2).max(80),
  unit: Joi.string().trim().min(1).max(30),
  minimumQuantity: Joi.number().min(0),
  unitCost: Joi.number().min(0),
  expiresAt: Joi.date().iso().allow(null),
  notes: Joi.string().trim().max(1000).allow("")
};

export const schemas = {
  create: Joi.object({
    ...fields,
    name: fields.name.required(),
    category: fields.category.required(),
    unit: fields.unit.required()
  }).unknown(false),
  update: Joi.object(fields).min(1).unknown(false)
};