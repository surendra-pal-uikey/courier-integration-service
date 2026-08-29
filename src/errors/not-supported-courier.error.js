export class NotSupportedCourierException extends Error {
  constructor(courier_type) {
    super(`Courier type ${courier_type} is not supported.`);
    this.name = "NotSupportedCourierException";
    this.statusCode = 404;
  }
}
