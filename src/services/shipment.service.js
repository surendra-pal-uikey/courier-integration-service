import pLimit from "p-limit";
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
import { ShipmentStatus } from "../enums/shipments.enum.js";
import { logOrderStatus } from "./shipment-status-log.service.js";
import { isUniqueShipmentOrder } from "../utils/idempotency.js";
import { TrackShipmentResponseDTO } from "../dtos/consignment-dto.js";
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

    try {
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

      // store the shipment details in the database
      const shipment = await Shipment.create({
        orderId: orderId,
        courierPartnerUsed: courierPartner,
        courierShipmentId: result.courierShipmentId,
        awbNumber: result.awbNumber,
        currentShipmentStatus: result.currentShipmentStatus || "CREATED",
      });

      return result;
    } catch (error) {
      const errorDetails = {
        orderId,
        courierPartner,
        requestId: error.response?.headers["x-request-id"] || "N/A",
        errorType: error.name || "UnknownError",
        stackTrace: error.stack || "No stack trace available",
      };

      throw {
        message: "Failed to create shipment",
        ...errorDetails,
      };
    }
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

    try {
      const result = await provider.trackShipment(awbNumber);
      await shipment.update({
        currentShipmentStatus: result.currentStatusCodeDescription,
      });

      const currentStatus = Object.keys(ShipmentStatus).find(
        (key) => ShipmentStatus[key] === result.currentStatusCodeDescription
      );

      await logOrderStatus(orderId, currentStatus);

      return TrackShipmentResponseDTO.parse({
        orderId: orderId,
        awbNumber: result.awbNumber,
        status: currentStatus,
        updateAt: result.currentStatusDateTime,
      });
    } catch (error) {
      const errorDetails = {
        orderId,
        courierPartner,
        requestId: error.response?.headers["x-request-id"] || "N/A",
        errorType: error.name || "UnknownError",
        stackTrace: error.stack || "No stack trace available",
      };

      throw {
        message: "Failed to track shipment",
        ...errorDetails,
      };
    }
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

    try {
      const result = await provider.cancelShipment(awbNumber);
      await shipment.update({
        currentShipmentStatus: ShipmentStatus.CANCELLED,
      });

      await logOrderStatus(orderId, Object.keys(ShipmentStatus)[4]);
      return result;
    } catch (error) {
      const errorDetails = {
        orderId,
        courierPartner,
        requestId: error.response?.headers["x-request-id"] || "N/A",
        errorType: error.name || "UnknownError",
        stackTrace: error.stack || "No stack trace available",
      };

      throw {
        message: "Failed to cancel shipment",
        ...errorDetails,
      };
    }
  }

  async bulkShipment(bulkShipmentData) {
    const provider = providerFactory.getProvider(preferredCarrierCode);
    // to execute the shipment creation in parallel with a limit of 10 concurrent requests
    const limit = pLimit(10);

    try {
      const promises = bulkShipmentData.map((shipmentData) =>
        limit(async () => {
          try {
            const originAddress = getOriginAddress();
            const destinationAddress = getDestinationAddress();
            const returnAddress = getReturnAddress();
            const invoiceDetails = getInvoiceDetails();
            const productDetails = getProductDetails();
            const orderDetails = getOrderDetails();

            const isUnique = await isUniqueShipmentOrder(shipmentData.order_id);

            if (!isUnique) {
              console.warn(
                `[Duplicated] skipping duplicate orderId: ${shipmentData.order_id}`
              );
              return;
            }

            const result = await provider.createShipment({
              originAddress,
              destinationAddress,
              returnAddress,
              invoiceDetails,
              productDetails,
              orderDetails: {
                ...orderDetails,
                orderId: shipmentData.order_id,
                customerCode: shipmentData.customer_code,
              },
            });
            return {
              status: "fulfilled",
              id: shipmentData.order_id,
              result,
            };
          } catch (error) {
            return {
              status: "rejected",
              id: shipmentData.order_id,
              error: error.message,
            };
          }
        })
      );
      const results = await Promise.all(promises);

      const successes = results.filter((r) => r.status === "fulfilled");
      const failures = results.filter((r) => r.status === "rejected");

      return {
        total: bulkShipmentData.length,
        successCount: successes.length,
        failureCount: failures.length,
        details: results,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ShipmentService();
