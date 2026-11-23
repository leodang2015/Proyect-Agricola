import { createResourceService } from "../../utils/resourceService.js";
import { preventDeleteWhenReferenced } from "../../utils/ensureOwned.js";
import { Terrain } from "./model.js";
import { Sowing } from "../siembras/model.js";
import { Cost } from "../costos/model.js";

export const service = createResourceService(Terrain, {
  beforeSave: async ({ ownerId, data, existing }) => {
    if (existing && data.areaHectares !== undefined) {
      const largestSowing = await Sowing.findOne({
        ownerId,
        terrainId: existing._id
      })
        .sort({ areaHectares: -1 })
        .select("areaHectares")
        .lean();

      if (largestSowing && data.areaHectares < largestSowing.areaHectares) {
        const error = new Error(
          "El área del terreno no puede ser menor que una siembra registrada"
        );
        error.status = 409;
        throw error;
      }
    }

    return data;
  },
  beforeDelete: async ({ ownerId, id }) => {
    await preventDeleteWhenReferenced(Sowing, { ownerId, terrainId: id });
    await preventDeleteWhenReferenced(Cost, { ownerId, terrainId: id });
  }
});