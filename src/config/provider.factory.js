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
      throw new Error(
        `Unsupported or unconfigured courier provider: '${providerCode}'`
      );
    }

    return provider;
  }
}

export default new ProviderFactory();
