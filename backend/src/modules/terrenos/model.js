import mongoose from "mongoose";

const terrainSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, trim: true, maxlength: 250 },
    areaHectares: { type: Number, required: true, min: 0.0001 },
    description: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["disponible", "en_preparacion", "sembrado", "cosechado", "en_descanso"],
      default: "disponible",
      index: true
    },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    soilType: { type: String, trim: true, maxlength: 120 },
    soilAnalysis: {
      analyzedAt: { type: Date },
      ph: { type: Number, min: 0, max: 14 },
      organicMatter: { type: Number, min: 0 },
      nitrogen: { type: Number, min: 0 },
      phosphorus: { type: Number, min: 0 },
      potassium: { type: Number, min: 0 },
      observations: { type: String, trim: true, maxlength: 1000 }
    },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Terrain =
  mongoose.models.Terrain || mongoose.model("Terrain", terrainSchema);