import Joi from "joi";

const fields = {
  name: Joi.string().trim().min(2).max(120),
  variety: Joi.string().trim().max(120).allow(""),
  cycleDays: Joi.number().integer().min(1),
  description: Joi.string().trim().max(1000).allow(""),
  active: Joi.boolean()
};

export const schemas = {
  create: Joi.object({
    ...fields,
    name: fields.name.required()
  }).unknown(false),
  update: Joi.object(fields).min(1).unknown(false)
};
