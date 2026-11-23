import { createResourceService } from "../../utils/resourceService.js";
import { preventDeleteWhenReferenced } from "../../utils/ensureOwned.js";
import { Crop } from "./model.js";
import { Sowing } from "../siembras/model.js";

export const service = createResourceService(Crop, {
  beforeDelete: ({ ownerId, id }) =>
    preventDeleteWhenReferenced(Sowing, { ownerId, cropId: id })
});
