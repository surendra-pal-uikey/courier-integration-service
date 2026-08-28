import { Router } from "express";
import {
  createShipmentController,
  trackShipmentController,
  cancelShipmentController,
  bulkShipmentController,
} from "../controllers/shipment.controller.js";

const router = Router();

router.post("", createShipmentController);
router.get("/:order_id/track", trackShipmentController);
router.post("/:order_id/cancel", cancelShipmentController);
router.post("/bulk", bulkShipmentController);

export default router;
