import Joi from "joi";

const fields = {
  name: Joi.string().trim().min(2).max(120),
  location: Joi.string().trim().max(250).allow(""),
  areaHectares: Joi.number().positive(),
  description: Joi.string().trim().max(1000).allow(""),
  status: Joi.string().valid(
    "disponible",
    "en_preparacion",
    "sembrado",
    "cosechado",
    "en_descanso"
  ),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  soilType: Joi.string().trim().max(120).allow(""),
  soilAnalysis: Joi.object({
    analyzedAt: Joi.date().iso(),
    ph: Joi.number().min(0).max(14),
    organicMatter: Joi.number().min(0),
    nitrogen: Joi.number().min(0),
    phosphorus: Joi.number().min(0),
    potassium: Joi.number().min(0),
    observations: Joi.string().trim().max(1000).allow("")
  }).unknown(false),
  active: Joi.boolean()
};

export const schemas = {
  create: Joi.object({
    ...fields,
    name: fields.name.required(),
    areaHectares: fields.areaHectares.required()
  }).unknown(false),
  update: Joi.object(fields).min(1).unknown(false)
};