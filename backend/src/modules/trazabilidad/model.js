import mongoose from "mongoose";

const traceEventSchema = new mongoose.Schema(
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
    eventType: {
      type: String,
      enum: ["observacion", "tratamiento", "riego", "otro"],
      required: true
    },
    occurredAt: { type: Date, required: true },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    inputs: [{ type: String, trim: true, maxlength: 120 }]
  },
  { timestamps: true }
);

export const TraceEvent =
  mongoose.models.TraceEvent ||
  mongoose.model("TraceEvent", traceEventSchema);
