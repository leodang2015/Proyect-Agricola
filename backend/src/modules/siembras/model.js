import mongoose from "mongoose";

const sowingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    terrainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Terrain",
      required: true,
      index: true
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
      index: true
    },
    areaHectares: { type: Number, required: true, min: 0.0001 },
    plantedAt: { type: Date, required: true },
    expectedHarvestAt: { type: Date },
    status: {
      type: String,
      enum: ["activa", "finalizada", "liquidada", "cancelada"],
      default: "activa"
    },
    notes: { type: String, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

export const Sowing =
  mongoose.models.Sowing || mongoose.model("Sowing", sowingSchema);
