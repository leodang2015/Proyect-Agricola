import { Router } from "express";
import Joi from "joi";
import { authenticate } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { getSummary } from "./controller.js";

const querySchema = Joi.object({
  from: Joi.date().iso(),
  to: Joi.date().iso().min(Joi.ref("from"))
}).unknown(false);

const router = Router();

router.use(authenticate);
router.get("/resumen", validate(querySchema, "query"), getSummary);

export default router;
