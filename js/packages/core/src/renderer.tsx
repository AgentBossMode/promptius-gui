import React from 'react';
import { Node, Edge, Event, EventType, EventAction, PromptiusGUISchema, UISchema } from '@promptius-gui/schemas';
import { useEventSystem } from './events';
import { ComponentFactory } from './factory';

interface GraphRendererProps {
  schema: PromptiusGUISchema;
}

export const GraphRenderer: React.FC<GraphRendererProps> = ({ schema }) => {
  const eventSystem = useEventSystem();
  const adapter = ComponentFactory.getAdapter();

  // Validate schema using Zod before rendering
  const validationResult = UISchema.safeParse(schema);
  if (!validationResult.success) {
    console.error('Schema validation failed:', validationResult.error);
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h3 className="text-red-800 font-semibold mb-2">Schema Validation Error</h3>
        <p className="text-red-700 mb-2">The provided schema is invalid and cannot be rendered.</p>
        <details className="text-sm text-red-600">
          <summary className="cursor-pointer font-medium">View validation errors</summary>
          <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
            {JSON.stringify(validationResult.error.errors, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  // Use the validated schema
  const validatedSchema = validationResult.data;

  // Create lookup maps for efficient access
  const nodeMap = new Map(validatedSchema.nodes.map(node => [node.id, node]));
  const edgeMap = new Map<string, Edge[]>();
  const eventMap = new Map<string, Event[]>();

  // Build adjacency list from edges
  validatedSchema.edges?.forEach(edge => {
    if (!edgeMap.has(edge.src)) {
      edgeMap.set(edge.src, []);
    }
    edgeMap.get(edge.src)!.push(edge);
  });

  // Build event map by nodeId
  validatedSchema.events?.forEach(event => {
    if (!eventMap.has(event.nodeId)) {
      eventMap.set(event.nodeId, []);
    }
    eventMap.get(event.nodeId)!.push(event);
  });

  const handleEvent = (action: EventAction, originalEvent?: React.SyntheticEvent) => {
    originalEvent?.preventDefault();

    switch (action.type) {
      case 'setState': {
        eventSystem.setState(action.key, action.value);
        return;
      }
      case 'submitForm': {
        // Basic submit stub; backend handles actual submission
        eventSystem.setState('submitStatus', 'pending');
        return;
      }
      case 'validate': {
        // Basic validate flag; detailed rules are backend-defined
        eventSystem.setState('isValid', true);
        return;
      }
      case 'navigate': {
        if (action.url) {
          if (action.target === '_blank') {
            window.open(action.url, '_blank');
          } else {
            window.location.href = action.url;
          }
        }
        return;
      }
      case 'custom': {
        const handler = action.handler && (eventSystem.handlers as any)[action.handler];
        if (typeof handler === 'function') handler();
        return;
      }
    }
  };

  const renderNode = (nodeId: string): React.ReactNode => {
    const node = nodeMap.get(nodeId);
    if (!node) {
      console.warn(`Node with id "${nodeId}" not found`);
      return null;
    }

    const componentAdapter = adapter[node.type as keyof typeof adapter];
    if (!componentAdapter) {
      return <div>Unknown component type: {node.type}</div>;
    }

    // Normalize props: the generator may provide props as null/undefined or as a JSON string
    const rawProps = (node as any).props;
    let processedProps = {};
    if (rawProps == null) {
      processedProps = {};
    } else if (typeof rawProps === 'string') {
      try {
        processedProps = JSON.parse(rawProps);
      } catch {
        processedProps = {};
      }
    } else {
      processedProps = rawProps;
    }

    // Get children nodes (sorted by order)
    const childEdges = edgeMap.get(nodeId) || [];
    const sortedChildren = childEdges
      .sort((a, b) => a.order - b.order)
      .map(edge => renderNode(edge.dest))
      .filter(Boolean);

    const renderedComponent = componentAdapter.render(
      { ...node, props: processedProps } as Node,
      sortedChildren.length > 0 ? sortedChildren : undefined
    );

    // Apply events if any
    const nodeEvents = eventMap.get(nodeId) || [];
    if (nodeEvents.length > 0 && React.isValidElement(renderedComponent)) {
      const eventProps: Record<string, any> = {};
      nodeEvents.forEach(event => {
        eventProps[event.eventType] = (e: React.SyntheticEvent) => handleEvent(event.action, e);
      });
      return React.cloneElement(renderedComponent, eventProps);
    }

    return renderedComponent;
  };

  // Start rendering from the root node
  const rootNode = nodeMap.get(validatedSchema.metadata.rootId);
  if (!rootNode) {
    return <div>Root node with id "{validatedSchema.metadata.rootId}" not found</div>;
  }

  return <>{renderNode(validatedSchema.metadata.rootId)}</>;
};

// Legacy renderer for backward compatibility (if needed)
export const DynamicRenderer: React.FC<{ component: any }> = ({ component }) => {
  console.warn('DynamicRenderer is deprecated. Use GraphRenderer with a complete schema instead.');
  return <div>Legacy renderer not supported in graph-based schema</div>;
};