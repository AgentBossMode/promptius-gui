import React from 'react';
import { UIComponent } from '@promptius-gui/schemas';

export interface ComponentAdapter {
  render: (component: UIComponent, children?: React.ReactNode) => React.ReactNode;
}

export interface AdapterRegistry {
  [key: string]: {
    [componentType: string]: ComponentAdapter;
  };
}

