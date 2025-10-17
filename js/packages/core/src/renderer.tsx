import React from 'react';
import { UIComponent, EventHandler } from '@dgui/schemas';
import { useEventSystem } from '@dgui/core/src/events';
import { ComponentFactory } from '@dgui/core/src/factory';

export const DynamicRenderer: React.FC<{ component: UIComponent }> = ({ component }) => {
  const eventSystem = useEventSystem();
  const adapter = ComponentFactory.getAdapter();

  const handleEvent = (event: EventHandler, originalEvent?: React.SyntheticEvent) => {
    originalEvent?.preventDefault();

    switch (event.type) {
      case 'setState':
        if (event.params?.key && event.params?.value !== undefined) {
          eventSystem.setState(event.params.key, event.params.value);
        }
        break;
      case 'submit':
        console.log('Form submitted:', eventSystem.state);
        eventSystem.setState('submitStatus', 'success');
        break;
      case 'validate':
        const isValid = event.params?.validator 
          ? event.params.validator(eventSystem.state)
          : true;
        eventSystem.setState('isValid', isValid);
        break;
      case 'custom':
        if (event.action && eventSystem.handlers[event.action]) {
          eventSystem.handlers[event.action](event.params);
        }
        break;
    }
  };

  const componentAdapter = adapter[component.type];
  if (!componentAdapter) {
    return <div>Unknown component type: {component.type}</div>;
  }

  const children = component.children?.map((child) => (
    <DynamicRenderer key={child.id} component={child} />
  ));

  const renderedComponent = componentAdapter.render(component, children);

  if (component.events && React.isValidElement(renderedComponent)) {
    const eventProps: Record<string, any> = {};

    Object.entries(component.events).forEach(([eventName, handler]: [string, EventHandler]) => {
      eventProps[eventName] = (e: React.SyntheticEvent) => handleEvent(handler, e);
    });

    return React.cloneElement(renderedComponent, eventProps);
  }

  return <>{renderedComponent}</>;
};