import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { updateProfileSchema } from "./schema.js";
import * as controller from "./controller.js";

const router = Router();

router.use(authenticate);
router.get("/me", controller.getProfile);
router.patch("/me", validate(updateProfileSchema), controller.updateProfile);

export default router;