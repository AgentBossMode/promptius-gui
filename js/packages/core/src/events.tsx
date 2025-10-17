import React, { createContext, useContext, useState } from 'react';
export interface EventContext {
  state: Record<string, any>;
  setState: (key: string, value: any) => void;
  handlers: Record<string, Function>;
  registerHandler: (name: string, handler: Function) => void;
}

export const EventSystemContext = createContext<EventContext | null>(null);

export const useEventSystem = () => {
  const context = useContext(EventSystemContext);
  if (!context) throw new Error('useEventSystem must be used within EventSystemProvider');
  return context;
};

export const EventSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setStateObj] = useState<Record<string, any>>({});
  const [handlers, setHandlers] = useState<Record<string, Function>>({});

  const setState = (key: string, value: any) => {
    setStateObj(prev => ({ ...prev, [key]: value }));
  };

  const registerHandler = (name: string, handler: Function) => {
    setHandlers(prev => ({ ...prev, [name]: handler }));
  };

  return (
    <EventSystemContext.Provider value={{ state, setState, handlers, registerHandler }}>
      {children}
    </EventSystemContext.Provider>
  );
};