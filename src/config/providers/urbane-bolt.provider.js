// src/providers/delhivery.provider.js
import { CreateShipmentRequest } from "../../dtos/consignment-dto.js";
import BaseProvider from "./base.provider.js";

class UrbanBoltProvider extends BaseProvider {
  constructor() {
    super("URBANE_BOLT");
  }

  createRequestObj(shipmentData) {
    const {
      originAddress,
      destinationAddress,
      returnAddress,
      invoiceDetails,
      productDetails,
      orderDetails,
    } = shipmentData;

    console.log("order details", orderDetails);

    return {
      customerCode: orderDetails.customerCode,
      orderNumber: orderDetails.orderId,
      declaredValue: orderDetails.declaredValue,
      itemDescription: productDetails.description,
      collectableValue: orderDetails.collectableValue,
      height: productDetails.dimensions.height,
      length: productDetails.dimensions.length,
      pieces: productDetails.pieces,
      weight: productDetails.dimensions.weight,
      breadth: productDetails.dimensions.breadth,
      serviceType: orderDetails.serviceType,
      payMode: orderDetails.payMode,
      rtnCity: returnAddress.city,
      rtnName: returnAddress.name,
      consCity: destinationAddress.city,
      consName: destinationAddress.name,
      rtnEmail: returnAddress.email,
      rtnState: returnAddress.state,
      shprCity: originAddress.city,
      shprName: originAddress.name,
      consEmail: destinationAddress.email,
      consState: destinationAddress.state,
      rtnMobile: returnAddress.mobile,
      shprEmail: originAddress.email,
      shprState: originAddress.state,
      consMobile: destinationAddress.mobile,
      rtnAddress: returnAddress.address,
      rtnAddressType: returnAddress.addressType,
      rtnCountry: returnAddress.country,
      rtnPincode: returnAddress.pincode,
      shprMobile: originAddress.mobile,
      consAddress: destinationAddress.address,
      consAddressType: destinationAddress.addressType,
      consCountry: destinationAddress.country,
      consPincode: destinationAddress.pincode,
      invoiceNumber: invoiceDetails.invoiceNumber,
      invoiceDate: invoiceDetails.invoiceDate,
      shprAddress: originAddress.address,
      shprAddressType: originAddress.addressType,
      shprCountry: originAddress.country,
      shprPincode: originAddress.pincode,
      invoiceValue: invoiceDetails.invoiceValue,
      itemQuantity: productDetails.quantity,
    };
  }
  async createShipment(shipmentData) {
    console.log("request reached at provider implementation");
    const req = this.createRequestObj(shipmentData);

    const validatedReq = CreateShipmentRequest.parse(req);
    console.log("validated req", validatedReq);
    return {
      awb: "DELHI-99887766",
      labelUrl: "https://delhivery.com/labels/DELHI-99887766.pdf",
    };
  }

  async trackShipment(awbNumber) {
    return {
      status: "IN_TRANSIT",
      location: "Mumbai Gateway Hub",
      timestamp: new Date().toISOString(),
    };
  }

  async cancelShipment(awbNumber) {
    return { success: true, message: "Shipment cancelled" };
  }

  async bulkShipment(bulkShipmentData) {
    return { success: true, message: "Shipment cancelled" };
  }
}

export default new UrbanBoltProvider();
