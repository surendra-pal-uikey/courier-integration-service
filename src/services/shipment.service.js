import providerFactory from "../config/provider.factory.js";

class ShipmentService {
  constructor() {}

  async createShipment(courierPartner, orderId, customerCode) {
    const provider = providerFactory.getProvider(courierPartner);
    const result = await provider.createShipment(orderId);

    console.log("Shipment created successfully:", result);
    return {
      awb: "DELHI-99887766",
      labelUrl: "https://delhivery.com/labels/DELHI-99887766.pdf",
      result,
    };
  }

  async trackShipment(orderId, courierPartner) {
    const provider = providerFactory.getProvider(courierPartner);
    const awbNumber = "DELHI-99887766"; // Replace with actual AWB number associated with the order
    const result = await provider.trackShipment(awbNumber);

    return {
      status: "IN_TRANSIT",
      location: "Mumbai Gateway Hub",
      timestamp: new Date().toISOString(),
      result,
    };
  }

  async cancelShipment(orderId, courierPartner) {
    const provider = providerFactory.getProvider(courierPartner);
    const cancelShipmentData = {
      awbs: ["DELHI-99887766"], // Replace with actual AWB number associated with the order
    };
    const result = await provider.cancelShipment(cancelShipmentData);

    return { success: true, message: "Shipment cancelled", result };
  }

  async bulkShipment(bulkShipmentData) {
    // const provider = providerFactory.getProvider(preferredCarrierCode);
    // const result = await provider.bulkShipment(bulkShipmentData);

    return { success: true, message: "Bulk shipment processed" };
  }
}

export default new ShipmentService();
