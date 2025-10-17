import React from 'react';
import { UISchema } from '@dgui/schemas';
import { EventSystemProvider } from '@dgui/core/src/events';
import { ComponentFactory } from '@dgui/core/src/factory';
import { DynamicRenderer } from '@dgui/core/src/renderer';

const UIFactory: React.FC<{ schema: UISchema }> = ({ schema }) => {
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
        <DynamicRenderer component={schema.root} />
      </div>
    </EventSystemProvider>
  );
};

export default UIFactory;
