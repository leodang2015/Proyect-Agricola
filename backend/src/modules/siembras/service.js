import { createResourceService } from "../../utils/resourceService.js";
import {
  ensureOwned,
  preventDeleteWhenReferenced
} from "../../utils/ensureOwned.js";
import { Sowing } from "./model.js";
import { Terrain } from "../terrenos/model.js";
import { Crop } from "../cultivos/model.js";
import { Harvest } from "../cosecha/model.js";
import { Cost } from "../costos/model.js";
import { TraceEvent } from "../trazabilidad/model.js";

export const service = createResourceService(Sowing, {
  populate: ["terrainId", "cropId"],
  beforeSave: async ({ ownerId, data, existing }) => {
    const terrainId = data.terrainId ?? existing?.terrainId;
    const cropId = data.cropId ?? existing?.cropId;
    const areaHectares = data.areaHectares ?? existing?.areaHectares;
    const terrain = await ensureOwned(Terrain, terrainId, ownerId);
    await ensureOwned(Crop, cropId, ownerId);

    if (terrain && areaHectares > terrain.areaHectares) {
      const error = new Error("El área sembrada no puede superar el área del terreno");
      error.status = 400;
      throw error;
    }

    if (existing && data.status) {
      const currentStatus = existing.status;
      const nextStatus = data.status;
      if (
        (currentStatus === "liquidada" && nextStatus !== "liquidada") ||
        (currentStatus === "finalizada" && nextStatus === "activa") ||
        (nextStatus === "liquidada" && currentStatus !== "finalizada")
      ) {
        const error = new Error("La transición de estado de la siembra no es válida");
        error.status = 409;
        throw error;
      }
    }

    if (!existing && (!data.status || data.status === "activa")) {
      await Terrain.updateOne(
        { _id: terrainId, ownerId },
        { $set: { status: "sembrado" } }
      );
    }

    if (existing && data.status === "finalizada") {
      await Terrain.updateOne(
        { _id: terrainId, ownerId },
        { $set: { status: "cosechado" } }
      );
    }

    if (existing && data.status === "liquidada") {
      await Terrain.updateOne(
        { _id: terrainId, ownerId },
        { $set: { status: "en_descanso" } }
      );
    }

    return data;
  },
  beforeDelete: async ({ ownerId, id }) => {
    await preventDeleteWhenReferenced(Harvest, { ownerId, sowingId: id });
    await preventDeleteWhenReferenced(Cost, { ownerId, sowingId: id });
    await preventDeleteWhenReferenced(TraceEvent, { ownerId, sowingId: id });
  }
});
