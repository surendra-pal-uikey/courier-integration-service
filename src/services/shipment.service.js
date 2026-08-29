import providerFactory from "../config/provider.factory.js";
import { ShipmentNotFoundException } from "../errors/shipment-not-found.error.js";
import { Shipment } from "../models/shipment.model.js";
import {
  getOriginAddress,
  getDestinationAddress,
  getReturnAddress,
  getProductDetails,
  getOrderDetails,
  getInvoiceDetails,
} from "../utils/dummyData.js";
class ShipmentService {
  constructor() {}

  async createShipment(courierPartner, orderId, customerCode) {
    const provider = providerFactory.getProvider(courierPartner);

    const originAddress = getOriginAddress();
    const destinationAddress = getDestinationAddress();
    const returnAddress = getReturnAddress();
    const invoiceDetails = getInvoiceDetails();
    const productDetails = getProductDetails();
    const orderDetails = getOrderDetails();

    const result = await provider.createShipment({
      originAddress,
      destinationAddress,
      returnAddress,
      invoiceDetails,
      productDetails,
      orderDetails: {
        ...orderDetails,
        orderId: orderId,
        customerCode: customerCode,
      },
    });

    console.log("Shipment created successfully:", result);
    return {
      awb: "DELHI-99887766",
      labelUrl: "https://delhivery.com/labels/DELHI-99887766.pdf",
      result,
    };
  }

  async trackShipment(orderId, courierPartner) {
    const provider = providerFactory.getProvider(courierPartner);

    const shipment = await Shipment.findOne({
      where: {
        orderId: orderId,
      },
    });

    if (!shipment) {
      throw new ShipmentNotFoundException(orderId);
    }

    const awbNumber = await shipment.awbNumber;

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

    const shipment = await Shipment.findOne({
      where: {
        orderId: orderId,
      },
    });

    if (!shipment) {
      throw new ShipmentNotFoundException(orderId);
    }

    const awbNumber = await shipment.awbNumber;

    const result = await provider.cancelShipment(awbNumber);

    return { success: true, message: "Shipment cancelled", result };
  }

  async bulkShipment(bulkShipmentData) {
    // const provider = providerFactory.getProvider(preferredCarrierCode);
    // const result = await provider.bulkShipment(bulkShipmentData);

    return { success: true, message: "Bulk shipment processed" };
  }
}

export default new ShipmentService();
