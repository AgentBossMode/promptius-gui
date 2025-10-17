import React from 'react';
import { UIComponent, EventType, EventAction } from '@promptius-gui/schemas';
import { useEventSystem } from './events';
import { ComponentFactory } from './factory';

export const DynamicRenderer: React.FC<{ component: UIComponent }> = ({ component }) => {
  const eventSystem = useEventSystem();
  const adapter = ComponentFactory.getAdapter();

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

  const componentAdapter = adapter[component.type];
  if (!componentAdapter) {
    return <div>Unknown component type: {component.type}</div>;
  }

  const processedComponent = { ...component } as any;

  // Normalize props: the generator may provide props as null/undefined or as a JSON string
  const rawProps = (component as any).props;
  if (rawProps == null) {
    processedComponent.props = {};
  } else if (typeof rawProps === 'string') {
    try {
      processedComponent.props = JSON.parse(rawProps);
    } catch {
      // If parsing fails, fall back to empty object to avoid runtime crashes
      processedComponent.props = {};
    }
  }

  const children = 'children' in processedComponent
    ? (processedComponent as unknown as { children?: UIComponent[] }).children?.map((child: UIComponent) => (
        <DynamicRenderer key={child.id} component={child} />
      ))
    : undefined;

  const renderedComponent = componentAdapter.render(processedComponent, children);

  if ('events' in processedComponent && React.isValidElement(renderedComponent)) {
    let rawEvents: unknown = (processedComponent as any).events;

    // Normalize events: accept undefined/null, JSON strings, arrays of tuples, or maps
    if (typeof rawEvents === 'string') {
      try {
        rawEvents = JSON.parse(rawEvents);
      } catch {
        rawEvents = undefined;
      }
    }

    let entries: [EventType, EventAction][] = [];

    if (Array.isArray(rawEvents)) {
      // Expecting [EventType, EventAction][]; filter out invalid items defensively
      entries = (rawEvents as any[])
        .filter((item) => Array.isArray(item) && item.length === 2)
        .map((item) => item as [EventType, EventAction]);
    } else if (rawEvents && typeof rawEvents === 'object') {
      // Support map form: { onClick: { type: 'setState', ... }, ... }
      entries = Object.entries(rawEvents as Record<string, EventAction>)
        .map(([k, v]) => [k as EventType, v]);
    }

    if (entries.length > 0) {
      const eventProps: Record<string, any> = {};
      entries.forEach(([eventName, action]) => {
        eventProps[eventName] = (e: React.SyntheticEvent) => handleEvent(action, e);
      });
      return React.cloneElement(renderedComponent, eventProps);
    }
  }

  return <>{renderedComponent}</>;
};