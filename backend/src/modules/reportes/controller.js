import mongoose from "mongoose";
import { Cost } from "../costos/model.js";
import { Harvest } from "../cosecha/model.js";
import { InventoryItem } from "../inventario/model.js";
import { Sowing } from "../siembras/model.js";
import { Terrain } from "../terrenos/model.js";
import { Crop } from "../cultivos/model.js";

export const getSummary = async (req, res) => {
  const ownerId = new mongoose.Types.ObjectId(req.user.id);
  const { from, to } = req.validatedQuery;
  const dateFilter = {};
  if (from || to) {
    dateFilter.$gte = from
      ? new Date(from)
      : new Date(0);
    dateFilter.$lte = to
      ? new Date(to)
      : new Date("9999-12-31T23:59:59.999Z");
  }

  const costFilter = { ownerId };
  const harvestFilter = { ownerId };
  if (Object.keys(dateFilter).length) {
    costFilter.incurredAt = dateFilter;
    harvestFilter.harvestedAt = dateFilter;
  }

  const [
    terrainCount,
    cropCount,
    sowingCount,
    activeSowingCount,
    costSummary,
    harvestSummary,
    inventoryItems
  ] = await Promise.all([
    Terrain.countDocuments({ ownerId }),
    Crop.countDocuments({ ownerId }),
    Sowing.countDocuments({ ownerId }),
    Sowing.countDocuments({
      ownerId,
      status: { $in: ["sembrada", "en_crecimiento"] }
    }),
    Cost.aggregate([
      { $match: costFilter },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          records: { $sum: 1 }
        }
      }
    ]),
    Harvest.aggregate([
      { $match: harvestFilter },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          records: { $sum: 1 }
        }
      }
    ]),
    InventoryItem.find({ ownerId })
      .select("name category quantity unit minimumQuantity")
      .lean()
  ]);

  const lowStock = inventoryItems.filter(
    (item) => item.quantity <= item.minimumQuantity
  );

  res.status(200).json({
    data: {
      terrainCount,
      cropCount,
      sowingCount,
      activeSowingCount,
      cost: costSummary[0] ?? { total: 0, records: 0 },
      harvest: harvestSummary[0] ?? { totalQuantity: 0, records: 0 },
      lowStock
    }
  });
};
