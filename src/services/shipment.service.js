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
import {
  CreateShipmentResponseDTO,
  TrackShipmentResponseDTO,
} from "../dtos/consignment-dto.js";
class ShipmentService {
  constructor() {}

  async createShipment(courierPartner, orderId, customerCode) {
    const shipment = await Shipment.findOne({
      where: {
        orderId: orderId,
      },
    });

    if (shipment) {
      return {
        message: "Order number is already processed: " + orderId,
      };
    }

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

      if (result.successResponse.length > 0) {
        const shipmentResponse = result.successResponse[0];
        const currentStatus = Object.keys(ShipmentStatus).find(
          (key) =>
            ShipmentStatus[key] ===
            shipmentResponse.currentStatusCodeDescription
        );

        // store the shipment details in the database
        const shipment = await Shipment.create({
          orderId: orderId,
          courierPartnerUsed: courierPartner,
          courierShipmentId: shipmentResponse.courierShipmentId,
          awbNumber: shipmentResponse.awbNumber,
          currentShipmentStatus: currentStatus || "CREATED",
        });

        return CreateShipmentResponseDTO.parse({
          orderId: shipment.orderId,
          courierPartnerUsed: shipment.courierPartnerUsed,
          courierShipmentId: shipmentResponse.courierShipmentId,
          awbNumber: shipment.awbNumber,
          status: shipment.currentShipmentStatus || "CREATED",
          createdAt: shipment.createdAt.toString(),
        });
      } else {
        return {
          ...result.errorResponse[0],
        };
      }
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
        courierPartnerUsed: courierPartner,
      },
    });

    if (!shipment) {
      throw new ShipmentNotFoundException(orderId);
    }

    const awbNumber = await shipment.awbNumber;

    try {
      const result = await provider.trackShipment(awbNumber);
      const currentStatus = Object.keys(ShipmentStatus).find(
        (key) => ShipmentStatus[key] === result.currentStatusCodeDescription
      );

      await shipment.update({
        currentShipmentStatus: currentStatus,
      });

      await logOrderStatus(orderId, currentStatus);

      return TrackShipmentResponseDTO.parse({
        orderId: orderId,
        awbNumber: result.awbNumber.toString(),
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
        courierPartnerUsed: courierPartner,
      },
    });

    if (!shipment) {
      throw new ShipmentNotFoundException(orderId);
    }

    const awbNumber = await shipment.awbNumber;

    try {
      const result = await provider.cancelShipment(awbNumber);
      const status = Object.keys(ShipmentStatus)[4];
      await shipment.update({
        currentShipmentStatus: status,
      });

      await logOrderStatus(orderId, status);
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

            const provider = providerFactory.getProvider(
              shipmentData.courier_partner
            );

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
