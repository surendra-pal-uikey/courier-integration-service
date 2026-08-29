import { z } from "zod";
import {
  AddressTypeEnum,
  CourierPartnerEnum,
  PayModeEnum,
} from "../enums/shipments.enum.js";

const Address = z.object({
  name: z.string().nonempty("Origin name is required"),
  address: z.string().nonempty("Origin address is required"),
  city: z.string().nonempty("Origin city is required"),
  state: z.string().nonempty("Origin state is required"),
  country: z.string().nonempty("Origin country is required"),
  pincode: z
    .number()
    .int()
    .positive("Origin pincode must be a positive integer"),
  mobile: z.number().int().positive("Origin mobile number must be valid"),
  email: z.string().email("Origin email must be valid"),
  addressType: AddressTypeEnum,
});

const Product = z.object({
  description: z.string().nonempty("Product description is required"),
  declaredValue: z.number().positive("Declared value must be greater than 0"),
  collectableValue: z
    .number()
    .nonnegative("Collectable value cannot be negative"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  pieces: z.number().int().positive("Pieces must be a positive integer"),
  dimensions: z.object({
    length: z.number().positive("Length must be greater than 0"),
    breadth: z.number().positive("Breadth must be greater than 0"),
    height: z.number().positive("Height must be greater than 0"),
    weight: z.number().positive("Weight must be greater than 0"),
  }),
});

const OrderDetailsDTO = z.object({
  // Order Details
  order: z.object({
    customerCode: z.string().nonempty("Customer code is required"),
    orderNumber: z.string().nonempty("Order number is required"),
    serviceType: z.string().nonempty("Service type is required"),
    payMode: PayModeEnum,
  }),

  // Product Details
  product: Product,

  // Invoice Details
  invoice: z.object({
    number: z.string().nonempty("Invoice number is required"),
    date: z.string().nonempty("Invoice date is required"),
    value: z.number().positive("Invoice value must be greater than 0"),
  }),

  // Address Details
  origin: Address,
  destination: Address,
  returnAddress: Address,
});

export const CreateShipmentRequestDTO = z.object({
  courier_partner: z.string().nonempty("Courier partner is required"),
  order_id: z.string().nonempty("Order ID is required"),
  customer_code: z.string().nonempty("Customer code is required"),
});

export const BulkShipmentRequestDTO = z.array(CreateShipmentRequestDTO);

export const TrackRequestDTO = z.object({
  courier_partner: z.string().nonempty("Courier partner is required"),
});

export const CancelRequestDTO = z.object({
  courier_partner: z.string().nonempty("Courier partner is required"),
});

export const CreateShipmentRequest = z.object({
  customerCode: z.string(),
  orderNumber: z.string(),
  declaredValue: z.number(),
  itemDescription: z.string(),
  collectableValue: z.number(),
  height: z.number(),
  length: z.number(),
  pieces: z.number(),
  weight: z.number(),
  breadth: z.number(),
  serviceType: z.string(),
  payMode: z.string(),
  rtnCity: z.string(),
  rtnName: z.string(),
  consCity: z.string(),
  consName: z.string(),
  rtnEmail: z.email(),
  rtnState: z.string(),
  shprCity: z.string(),
  shprName: z.string(),
  consEmail: z.email(),
  consState: z.string(),
  rtnMobile: z.number(),
  shprEmail: z.email(),
  shprState: z.string(),
  consMobile: z.number(),
  rtnAddress: z.string(),
  rtnAddressType: z.string(),
  rtnCountry: z.string(),
  rtnPincode: z.number(),
  shprMobile: z.number(),
  consAddress: z.string(),
  consAddressType: AddressTypeEnum,
  consCountry: z.string(),
  consPincode: z.number(),
  invoiceNumber: z.string(),
  invoiceDate: z.string(),
  shprAddress: z.string(),
  shprAddressType: AddressTypeEnum,
  shprCountry: z.string(),
  shprPincode: z.number(),
  invoiceValue: z.number(),
  itemQuantity: z.number(),
});
