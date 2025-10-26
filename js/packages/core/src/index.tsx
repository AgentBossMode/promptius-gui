import React from 'react';
import { PromptiusGUISchema } from '@promptius-gui/schemas';
import { EventSystemProvider } from './events';
import { ComponentFactory } from './factory';
import { GraphRenderer } from './renderer';

const UIFactory: React.FC<{ schema: PromptiusGUISchema }> = ({ schema }) => {
  if (schema.metadata?.framework) {
    ComponentFactory.useAdapter(schema.metadata.framework);
  }

  return (
    <EventSystemProvider>
      <div className="w-full">
        {schema.metadata?.title && (
          <h1 className="text-2xl font-bold mb-2">{schema.metadata.title}</h1>
        )}
        {schema.metadata?.description && (
          <p className="text-gray-600 mb-6">{schema.metadata.description}</p>
        )}
        <GraphRenderer schema={schema} />
      </div>
    </EventSystemProvider>
  );
};

export default UIFactory;
export { EventSystemProvider, useEventSystem } from './events';
export { ComponentFactory } from './factory';
export { GraphRenderer, DynamicRenderer } from './renderer';
export type { AdapterRegistry, ComponentAdapter } from '@promptius-gui/adapters';
