import { ShipmentStatus } from "../enums/shipments.enum.js";
import { ShipmentStatusLog } from "../models/shipment-status.model.js";

export async function logOrderStatus(orderId, currentStatus) {
  try {
    const key = Object.keys(ShipmentStatus).find(
      (key) => ShipmentStatus[key] === currentStatus
    );

    const newLogEntry = new ShipmentStatusLog({
      metadata: { orderId: orderId },
      status: key,
    });

    await newLogEntry.save();
    console.log(
      `Status '${currentStatus}' logged for shipment Order: ${orderId}`
    );
  } catch (error) {
    console.error("Failed to append log:", error.message);
  }
}
