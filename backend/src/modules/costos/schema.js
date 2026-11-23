import Joi from "joi";

const objectId = Joi.string().hex().length(24).allow(null);
const fields = {
  category: Joi.string().trim().min(2).max(80),
  description: Joi.string().trim().min(2).max(250),
  amount: Joi.number().min(0),
  incurredAt: Joi.date().iso(),
  terrainId: objectId,
  sowingId: objectId,
  notes: Joi.string().trim().max(1000).allow("")
};

export const schemas = {
  create: Joi.object({
    ...fields,
    category: fields.category.required(),
    description: fields.description.required(),
    amount: fields.amount.required(),
    incurredAt: fields.incurredAt.required()
  }).unknown(false),
  update: Joi.object(fields).min(1).unknown(false)
};
