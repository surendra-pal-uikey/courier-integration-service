import { TrackingEvent } from "../models/tracking.model.js";

export async function logActivity(orderId, requestPayload, responsePayload) {
  try {
    const trackingEvent = new TrackingEvent({
      order_id: orderId,
      reqObj: requestPayload,
      resObj: responsePayload,
    });
    await trackingEvent.save();
    console.log(`Logged tracking event for shipment Order: ${orderId}`);
  } catch (error) {
    console.error("Failed to log tracking activity:", error.message);
  }
}
