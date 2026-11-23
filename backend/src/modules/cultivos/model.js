import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    variety: { type: String, trim: true, maxlength: 120 },
    cycleDays: { type: Number, min: 1 },
    description: { type: String, trim: true, maxlength: 1000 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Crop = mongoose.models.Crop || mongoose.model("Crop", cropSchema);
