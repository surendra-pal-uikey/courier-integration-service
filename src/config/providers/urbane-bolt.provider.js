import { CourierPartnerAPIError } from "../../errors/courier-partner-api.error.js";
import { CreateShipmentRequest } from "../../dtos/consignment-dto.js";
import {
  createManifest,
  cancelShipment,
  trackShipment,
} from "../../api/index.js";
import BaseProvider from "./base.provider.js";
import { logActivity } from "../../services/tracking.service.js";

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

    try {
      const resp = await createManifest(validatedReq);

      // logging req and resp object inside the mongodb
      await logActivity(validatedReq.orderNumber, validatedReq, resp);
      return resp;
    } catch (error) {
      throw new CourierPartnerAPIError(
        "URBANE_BOLT",
        "/services/manifest/",
        error.response?.status || 500,
        error.response?.data || error.message
      );
    }
  }

  async trackShipment(awbNumber) {
    try {
      const resp = await trackShipment(awbNumber);
      return resp;
    } catch (error) {
      throw new CourierPartnerAPIError(
        "URBANE_BOLT",
        `/services/tracking-pub/?awb=${awbNumber}`,
        error.response?.status || 500,
        error.response?.data || error.message
      );
    }
  }

  async cancelShipment(awbNumber) {
    try {
      const resp = await cancelShipment({ awbs: awbNumber });
      return resp;
    } catch (error) {
      throw new CourierPartnerAPIError(
        "URBANE_BOLT",
        "/services/cancel/",
        error.response?.status || 500,
        error.response?.data || error.message
      );
    }
  }
}

export default new UrbanBoltProvider();
