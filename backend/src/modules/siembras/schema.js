import Joi from "joi";

const objectId = Joi.string().hex().length(24);
const fields = {
  terrainId: objectId,
  cropId: objectId,
  areaHectares: Joi.number().positive(),
  plantedAt: Joi.date().iso(),
  expectedHarvestAt: Joi.date().iso().allow(null),
  status: Joi.string().valid(
    "activa",
    "finalizada",
    "liquidada",
    "cancelada"
  ),
  notes: Joi.string().trim().max(1000).allow("")
};

export const schemas = {
  create: Joi.object({
    ...fields,
    terrainId: fields.terrainId.required(),
    cropId: fields.cropId.required(),
    areaHectares: fields.areaHectares.required(),
    plantedAt: fields.plantedAt.required()
  }).unknown(false),
  update: Joi.object(fields).min(1).unknown(false)
};
