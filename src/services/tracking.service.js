import { TrackingEvent } from "./tracking.model";

async function logActivity(orderId, requestPayload, responsePayload) {
  const logEvent = await TrackingEvent.create({
    order_id: orderId,
    reqObj: requestPayload,
    resObj: responsePayload,
  });

  return logEvent;
}
