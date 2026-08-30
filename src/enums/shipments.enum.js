import { z } from "zod";

export const CourierPartnerEnum = z.enum(["URBANE_BOLT", "MOCK_COURIER"], {
  errorMap: () => ({
    message: "Courier Partner must be 'URBANE_BOLT' or 'MOCK_COURIER'",
  }),
});

export const PayModeEnum = z.enum(["COD", "PREPAID"], {
  errorMap: () => ({ message: "Pay mode must be 'COD' or 'PREPAID'" }),
});

export const AddressTypeEnum = z.enum(
  ["Home", "Office", "Seller", "Warehouse"],
  {
    errorMap: () => ({
      message:
        "Address type must be 'Seller', 'Office', 'Home', or 'Warehouse'",
    }),
  }
);

export const ShipmentStatus = Object.freeze({
  CREATED: "Shipment Manifested",
  PICKED_UP: "Picked up",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  FAILED: "Failed",
});
