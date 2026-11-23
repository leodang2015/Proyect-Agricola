import mongoose from "mongoose";

const costSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 250 },
    amount: { type: Number, required: true, min: 0 },
    incurredAt: { type: Date, required: true },
    terrainId: { type: mongoose.Schema.Types.ObjectId, ref: "Terrain" },
    sowingId: { type: mongoose.Schema.Types.ObjectId, ref: "Sowing" },
    notes: { type: String, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

export const Cost = mongoose.models.Cost || mongoose.model("Cost", costSchema);
