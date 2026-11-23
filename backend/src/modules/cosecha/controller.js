import { createResourceController } from "../../utils/resourceController.js";
import { service } from "./service.js";

export const controller = createResourceController(service);
