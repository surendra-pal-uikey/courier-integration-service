import shipmentService from "./shipment.service";

async function createShipmentController(req, res, next) {
  try {
    const { preferredCarrierCode } = req.body;
    const result = await shipmentService.createShipment(req.body);
    return res.status(201).json({
      success: true,
      provider: preferredCarrierCode,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function trackShipmentController(req, res, next) {
  try {
    const { preferredCarrierCode } = req.body;
    const result = await shipmentService.trackShipment(req.body);
    return res.status(201).json({
      success: true,
      provider: preferredCarrierCode,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function cancelShipmentController(req, res, next) {
  try {
    const result = await shipmentService.cancelShipment(req.body);

    return res.status(201).json({
      success: true,
      provider: preferredCarrierCode,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function bulkShipmentController(req, res, next) {
  try {
    const { preferredCarrierCode } = req.body;
    const result = await shipmentService.bulkShipment(req.body);
    return res.status(201).json({
      success: true,
      provider: preferredCarrierCode,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  createShipmentController,
  trackShipmentController,
  cancelShipmentController,
  bulkShipmentController,
};
