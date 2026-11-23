import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    quantity: { type: Number, required: true, min: 0, default: 0, immutable: true },
    unit: { type: String, required: true, trim: true, maxlength: 30 },
    minimumQuantity: { type: Number, min: 0, default: 0 },
    unitCost: { type: Number, min: 0, default: 0 },
    expiresAt: { type: Date },
    notes: { type: String, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

export const InventoryItem =
  mongoose.models.InventoryItem ||
  mongoose.model("InventoryItem", inventorySchema);
