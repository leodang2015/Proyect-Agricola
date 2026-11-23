import { createResourceRoutes } from "../../utils/resourceRoutes.js";
import { controller } from "./controller.js";
import { schemas } from "./schema.js";

export default createResourceRoutes(controller, schemas);