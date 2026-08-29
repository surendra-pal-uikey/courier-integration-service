export class CourierPartnerAPIError extends Error {
  constructor(apiName, endpoint, statusCode, message) {
    super(message);
    this.name = "CourierPartnerAPIError";
    this.apiName = apiName;
    this.endpoint = endpoint;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}
