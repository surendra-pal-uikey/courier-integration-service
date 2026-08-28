import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    index: true,
  },

  reqObj: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },

  resObj: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

trackingSchema.set("timestamps", { createdAt: "createdAt", updatedAt: false });

export const TrackingEvent = mongoose.model("TrackingEvent", trackingSchema);
