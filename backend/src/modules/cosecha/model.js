import mongoose from "mongoose";

const harvestSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    sowingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sowing",
      required: true,
      index: true
    },
    harvestedAt: { type: Date, required: true },
    quantity: { type: Number, required: true, min: 0.0001 },
    unit: { type: String, required: true, trim: true, maxlength: 30 },
    quality: { type: String, trim: true, maxlength: 80 },
    notes: { type: String, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

export const Harvest =
  mongoose.models.Harvest || mongoose.model("Harvest", harvestSchema);
