import {
  BulkShipmentRequestDTO,
  CreateShipmentRequestDTO,
  TrackRequestDTO,
  CancelRequestDTO,
} from "../dtos/consignment-dto.js";
import shipmentService from "../services/shipment.service.js";

export async function createShipmentController(req, res, next) {
  try {
    const validatedData = CreateShipmentRequestDTO.parse(req.body);
    const { courier_partner, order_id, customer_code } = validatedData;

    const result = await shipmentService.createShipment(
      courier_partner,
      order_id,
      customer_code
    );

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function trackShipmentController(req, res, next) {
  try {
    const orderId = req.params.order_id;
    const validatedData = TrackRequestDTO.parse(req.body);
    const result = await shipmentService.trackShipment(
      orderId,
      validatedData.courier_partner
    );
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelShipmentController(req, res, next) {
  try {
    const orderId = req.params.order_id;
    const validatedData = CancelRequestDTO.parse(req.body);
    const result = await shipmentService.cancelShipment(
      orderId,
      validatedData.courier_partner
    );

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function bulkShipmentController(req, res, next) {
  try {
    const validatedBulkReq = BulkShipmentRequestDTO.parse(req.body);

    const result = await shipmentService.bulkShipment(validatedBulkReq);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
