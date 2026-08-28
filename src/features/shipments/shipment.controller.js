import shipmentService from "./shipment.service.js";

export async function createShipmentController(req, res, next) {
  try {
    const { shipmentData, preferredCarrierCode } = req.body;
    const result = await shipmentService.createShipment(
      shipmentData,
      preferredCarrierCode
    );
    return res.status(201).json({
      success: true,
      provider: preferredCarrierCode,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function trackShipmentController(req, res, next) {
  try {
    const awbNumber = req.params.id;
    const { preferredCarrierCode } = req.body;
    const result = await shipmentService.trackShipment(
      awbNumber,
      preferredCarrierCode
    );
    return res.status(201).json({
      success: true,
      provider: preferredCarrierCode,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelShipmentController(req, res, next) {
  try {
    const { cancelShipmentData, preferredCarrierCode } = req.body;
    const result = await shipmentService.cancelShipment(
      cancelShipmentData,
      preferredCarrierCode
    );

    return res.status(201).json({
      success: true,
      provider: preferredCarrierCode,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function bulkShipmentController(req, res, next) {
  try {
    const { bulkShipmentData, preferredCarrierCode } = req.body;

    const result = await shipmentService.bulkShipment(
      bulkShipmentData,
      preferredCarrierCode
    );
    return res.status(201).json({
      success: true,
      provider: preferredCarrierCode,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
