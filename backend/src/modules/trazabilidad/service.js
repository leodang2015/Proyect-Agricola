import { createResourceService } from "../../utils/resourceService.js";
import { ensureOwned } from "../../utils/ensureOwned.js";
import { TraceEvent } from "./model.js";
import { Sowing } from "../siembras/model.js";

export const service = createResourceService(TraceEvent, {
  populate: ["sowingId"],
  beforeSave: async ({ ownerId, data, existing }) => {
    await ensureOwned(Sowing, data.sowingId ?? existing?.sowingId, ownerId);
    return data;
  }
});
