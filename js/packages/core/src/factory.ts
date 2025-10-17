import { AdapterRegistry, ComponentAdapter } from '@dgui/adapters';

export class ComponentFactory {
  private static adapters: AdapterRegistry = {};
  private static currentAdapter: string = 'material-ui';

  static registerAdapter(name: string, adapter: Record<string, ComponentAdapter>) {
    this.adapters[name] = adapter;
  }

  static useAdapter(adapterName: string) {
    if (!this.adapters[adapterName]) {
      throw new Error(`Adapter "${adapterName}" not found. Make sure you have imported the adapter package.`);
    }
    this.currentAdapter = adapterName;
  }

  static getAdapter() {
    return this.adapters[this.currentAdapter];
  }

  static getCurrentAdapterName() {
    return this.currentAdapter;
  }

  static getAvailableAdapters() {
    return Object.keys(this.adapters);
  }
}
