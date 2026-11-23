import { createResourceController } from "../../utils/resourceController.js";
import { service } from "./service.js";
import { Sowing } from "../siembras/model.js";
import { Harvest } from "../cosecha/model.js";
import { Cost } from "../costos/model.js";
import { TraceEvent } from "./model.js";

export const controller = createResourceController(service);

export const getSowingTimeline = async (req, res) => {
  const sowing = await Sowing.findOne({
    _id: req.params.sowingId,
    ownerId: req.user.id
  })
    .populate("terrainId", "name location areaHectares")
    .populate("cropId", "name variety")
    .lean();

  if (!sowing) {
    const error = new Error("Siembra no encontrada");
    error.status = 404;
    throw error;
  }

  const [events, harvests, costs] = await Promise.all([
    TraceEvent.find({ ownerId: req.user.id, sowingId: sowing._id })
      .sort({ occurredAt: 1 })
      .lean(),
    Harvest.find({ ownerId: req.user.id, sowingId: sowing._id })
      .sort({ harvestedAt: 1 })
      .lean(),
    Cost.find({ ownerId: req.user.id, sowingId: sowing._id })
      .sort({ incurredAt: 1 })
      .lean()
  ]);

  res.status(200).json({
    data: { sowing, events, harvests, costs }
  });
};
