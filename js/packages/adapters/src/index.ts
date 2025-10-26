import React from 'react';
import { Node } from '@promptius-gui/schemas';

export interface ComponentAdapter {
  render: (component: Node, children?: React.ReactNode) => React.ReactNode;
}

export interface AdapterRegistry {
  [key: string]: {
    [componentType: string]: ComponentAdapter;
  };
}

