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
      enum: [...Object.values(ShipmentStatus)],
    },
  },
  {
    // Disable automatic version keys since documents never update
    versionKey: false,
  }
);

// GUARD RAIL: Intercept and block any update queries at the software level
const blockMutations = function (next) {
  const error = new Error(
    "Write Operational Error: This collection is strictly append-only."
  );
  next(error);
};

shipmentStatusLogSchema.pre(
  ["updateOne", "updateMany", "findOneAndUpdate", "replaceOne"],
  blockMutations
);
shipmentStatusLogSchema.pre(
  ["deleteOne", "deleteMany", "findOneAndDelete"],
  blockMutations
);

// Prevent editing an existing document instance if someone calls log.status = 'X'; log.save();
shipmentStatusLogSchema.pre("save", function (next) {
  if (!this.isNew) {
    return next(
      new Error(
        "Write Operational Error: Cannot update existing immutable documents."
      )
    );
  }
  next();
});

export const ShipmentStatusLog = mongoose.model(
  "ShipmentStatusTracking",
  shipmentStatusLogSchema,
  "shipment_status_logs"
);
