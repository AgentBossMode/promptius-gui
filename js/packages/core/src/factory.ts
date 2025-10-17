import { AdapterRegistry } from '@dgui/adapters';
import { materialUIAdapter } from '@dgui/material-ui';
import { chakraUIAdapter } from '@dgui/chakra-ui';
import { antDesignAdapter } from '@dgui/ant-design';

export const adapters: AdapterRegistry = {
  'material-ui': materialUIAdapter,
  'chakra-ui': chakraUIAdapter,
  'ant-design': antDesignAdapter,
};

export class ComponentFactory {
  private static currentAdapter: keyof typeof adapters = 'material-ui';

  static useAdapter(adapterName: keyof typeof adapters) {
    if (!adapters[adapterName]) {
      throw new Error(`Adapter "${adapterName}" not found`);
    }
    this.currentAdapter = adapterName;
  }

  static getAdapter() {
    return adapters[this.currentAdapter];
  }

  static getCurrentAdapterName() {
    return this.currentAdapter;
  }
}
