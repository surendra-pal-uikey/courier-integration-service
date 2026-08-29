export default class BaseProvider {
  constructor(providerName) {
    if (this.constructor === BaseProvider) {
      throw new Error(
        "BaseProvider is an abstract class and cannot be instantiated directly."
      );
    }
    this.providerName = providerName;
  }

  async createShipment(shipmentData) {
    throw new Error(
      `Method 'createManifest()' must be implemented by class ${this.constructor.name}.`
    );
  }

  async trackShipment(awbNumber) {
    throw new Error(
      `Method 'trackShipment()' must be implemented by class ${this.constructor.name}.`
    );
  }

  async cancelShipment(cancelShipmentData) {
    throw new Error(
      `Method 'cancelShipment()' must be implemented by class ${this.constructor.name}.`
    );
  }
}
