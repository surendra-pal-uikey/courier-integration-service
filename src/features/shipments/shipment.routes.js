import { Router } from "express";
import {
  createShipmentController,
  trackShipmentController,
  cancelShipmentController,
  bulkShipmentController,
} from "./shipment.controller.js";

const router = Router();

router.post("", createShipmentController);
router.get("/:id/track", trackShipmentController);
router.post("/:id/cancel", cancelShipmentController);
router.post("/bulk", bulkShipmentController);

export default router;
