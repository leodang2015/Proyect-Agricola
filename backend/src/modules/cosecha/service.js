import { createResourceService } from "../../utils/resourceService.js";
import { ensureOwned } from "../../utils/ensureOwned.js";
import { Harvest } from "./model.js";
import { Sowing } from "../siembras/model.js";

export const service = createResourceService(Harvest, {
  populate: ["sowingId"],
  beforeSave: async ({ ownerId, data, existing }) => {
    const sowing = await ensureOwned(
      Sowing,
      data.sowingId ?? existing?.sowingId,
      ownerId
    );
    const harvestedAt = data.harvestedAt ?? existing?.harvestedAt;

    if (sowing.status === "cancelada" || harvestedAt < sowing.plantedAt) {
      const error = new Error("La cosecha no es válida para el estado o fecha de la siembra");
      error.status = 400;
      throw error;
    }

    return data;
  }
});
