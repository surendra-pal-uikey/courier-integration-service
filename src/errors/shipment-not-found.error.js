export class ShipmentNotFoundException extends Error {
  constructor(orderId) {
    super(`Shipment with Order ID ${orderId} not found.`);
    this.name = "ShipmentNotFoundException";
    this.statusCode = 404; // HTTP status code for "Not Found"
  }
}
