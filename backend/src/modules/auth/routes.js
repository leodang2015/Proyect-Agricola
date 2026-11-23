import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import * as controller from "./controller.js";
import { loginSchema, registerSchema } from "./schema.js";

const router = Router();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);

export default router;