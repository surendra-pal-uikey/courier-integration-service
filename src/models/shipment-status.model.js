import mongoose from "mongoose";
import { ShipmentStatus } from "../enums/shipments.enum.js";

const shipmentStatusLogSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    metadata: {
      orderId: { type: String, required: true },
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: Object.keys(ShipmentStatus),
        message: "{VALUE} is not a valid shipment status",
      },
    },
  },
  {
    // Disable automatic version keys since documents never update
    versionKey: false,
  }
);

// Guard rail function for update/delete queries
const blockMutations = function () {
  throw new Error(
    "Write Operational Error: This collection is strictly append-only."
  );
};

// Explicitly register each query mutation hook to prevent parameter mismatches
[
  "updateOne",
  "updateMany",
  "findOneAndUpdate",
  "replaceOne",
  "deleteOne",
  "deleteMany",
  "findOneAndDelete",
].forEach((method) => {
  shipmentStatusLogSchema.pre(method, blockMutations);
});

// Fixed save middleware
shipmentStatusLogSchema.pre("save", function () {
  if (!this.isNew) {
    throw new Error(
      "Write Operational Error: Cannot update existing immutable documents."
    );
  }
});

export const ShipmentStatusLog = mongoose.model(
  "ShipmentStatusTracking",
  shipmentStatusLogSchema,
  "shipment_status_logs"
);
