import { createResourceRoutes } from "../../utils/resourceRoutes.js";
import { controller, getSowingTimeline } from "./controller.js";
import { schemas } from "./schema.js";
import { validate } from "../../middlewares/validate.js";
import Joi from "joi";

const router = createResourceRoutes(controller, schemas);
const sowingIdSchema = Joi.object({
  sowingId: Joi.string().hex().length(24).required()
});

router.get(
  "/siembra/:sowingId",
  validate(sowingIdSchema, "params"),
  getSowingTimeline
);

export default router;
