import { NotSupportedCourierException } from "../errors/not-supported-courier.error.js";
import urbaneBoltProvider from "./providers/urbane-bolt.provider.js";

class ProviderFactory {
  constructor() {
    this.providers = {
      URBANE_BOLT: urbaneBoltProvider,
    };
  }

  getProvider(providerCode) {
    const provider = this.providers[providerCode];

    if (!provider) {
      throw new NotSupportedCourierException(providerCode);
    }

    return provider;
  }
}

export default new ProviderFactory();
