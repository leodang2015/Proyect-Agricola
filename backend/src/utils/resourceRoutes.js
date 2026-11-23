import { Router } from "express";
import Joi from "joi";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";

const idSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

export const createResourceRoutes = (controller, schemas) => {
  const router = Router();
  router.use(authenticate);
  router.get("/", validate(querySchema, "query"), controller.list);
  router.post("/", validate(schemas.create), controller.create);
  router.get("/:id", validate(idSchema, "params"), controller.get);
  router.patch(
    "/:id",
    validate(idSchema, "params"),
    validate(schemas.update),
    controller.update
  );
  router.delete("/:id", validate(idSchema, "params"), controller.remove);
  return router;
};
