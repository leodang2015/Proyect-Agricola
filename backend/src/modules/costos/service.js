import { createResourceService } from "../../utils/resourceService.js";
import { ensureOwned } from "../../utils/ensureOwned.js";
import { Cost } from "./model.js";
import { Terrain } from "../terrenos/model.js";
import { Sowing } from "../siembras/model.js";

export const service = createResourceService(Cost, {
  populate: ["terrainId", "sowingId"],
  beforeSave: async ({ ownerId, data, existing }) => {
    const terrainId = data.terrainId ?? existing?.terrainId;
    const sowing = await ensureOwned(
      Sowing,
      data.sowingId ?? existing?.sowingId,
      ownerId
    );
    await ensureOwned(Terrain, terrainId, ownerId);

    if (terrainId && sowing && !sowing.terrainId.equals(terrainId)) {
      const error = new Error("El terreno debe coincidir con el terreno de la siembra");
      error.status = 400;
      throw error;
    }

    return data;
  }
});
