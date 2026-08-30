import { ShipmentStatus } from "../../enums/shipments.enum.js";
import BaseProvider from "./base.provider.js";
import { logActivity } from "../../services/tracking.service.js";
import { logOrderStatus } from "../../services/shipment-status-log.service.js";

class MockCourierProvider extends BaseProvider {
  constructor() {
    super("MOCK_COURIER");
  }

  async createShipment(shipmentData) {
    const { orderDetails, productDetails, invoiceDetails } = shipmentData;
    await new Promise((resolve) => setTimeout(resolve, 100));
    const request = {
      customerCode: orderDetails.customerCode,
      orderId: orderDetails.orderId,
      itemDescription: productDetails.description,
      itemQuantity: productDetails.quantity,
      invoiceValue: invoiceDetails.invoiceValue,
    };

    const currentStatus = Object.keys(ShipmentStatus).find(
      (key) => ShipmentStatus[key] === ShipmentStatus.CREATED
    );

    const response = {
      status: true,
      successResponse: [
        {
          orderId: orderDetails.orderId,
          courierShipmentId: "shipmentId1",
          awbNumber: "200000001171",
          currentStatusCodeDescription: ShipmentStatus.CREATED,
        },
      ],
      errorResponse: [{}],
    };

    await logActivity(orderDetails.orderId, request, response);
    if (response.successResponse.length > 0) {
      await logOrderStatus(orderDetails.orderId, currentStatus);
    }
    return response;
  }

  async trackShipment(awbNumber) {
    const resp = {
      orderId: "order1",
      courierPartnerUsed: "MOCK_COURIER",
      courierShipmentId: "shipmentId1",
      awbNumber: awbNumber.toString(),
      currentStatusCodeDescription: ShipmentStatus.IN_TRANSIT,
      currentStatusDateTime: new Date().toDateString(),
    };
    return resp;
  }

  async cancelShipment(awbNumber) {
    const resp = {
      orderId: "order1",
      courierPartnerUsed: "MOCK_COURIER",
      courierShipmentId: "shipmentId1",
      awbNumber: awbNumber.toString(),
      currentStatusCodeDescription: ShipmentStatus.CANCELLED,
      updatedAt: new Date().toDateString(),
    };
    return resp;
  }
}

export default new MockCourierProvider();
