import { TrackingEvent } from "../models/tracking.model.js";

export async function logActivity(orderId, requestPayload, responsePayload) {
  const logEvent = await TrackingEvent.create({
    order_id: orderId,
    reqObj: requestPayload,
    resObj: responsePayload,
  });

  return logEvent;
}
