import providerFactory from "./provider.factory";

class ShipmentService {
  constructor() {}

  async createShipment(shipmentData) {
    const { preferredCarrierCode } = req.body;
    const provider = providerFactory.getProvider(preferredCarrierCode);
    const result = await provider.createShipment(shipmentData);

    return {
      awb: "DELHI-99887766",
      labelUrl: "https://delhivery.com/labels/DELHI-99887766.pdf",
      result,
    };
  }

  async trackShipment(awbNumber) {
    const { preferredCarrierCode } = req.body;
    const provider = providerFactory.getProvider(preferredCarrierCode);
    const result = await provider.trackShipment(awbNumber);

    return {
      status: "IN_TRANSIT",
      location: "Mumbai Gateway Hub",
      timestamp: new Date().toISOString(),
      result,
    };
  }

  async cancelShipment(cancelShipmentData) {
    const { preferredCarrierCode } = req.body;
    const provider = providerFactory.getProvider(preferredCarrierCode);
    const result = await provider.cancelShipment(cancelShipmentData);

    return { success: true, message: "Shipment cancelled", result };
  }

  async bulkShipment(bulkShipmentData) {
    const { preferredCarrierCode } = req.body;
    const provider = providerFactory.getProvider(preferredCarrierCode);
    const result = await provider.bulkShipment(bulkShipmentData);

    return { success: true, message: "Shipment cancelled", result };
  }
}

export default new ShipmentService();
