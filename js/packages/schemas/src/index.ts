export type ComponentType = 
  | 'button' 
  | 'input' 
  | 'text' 
  | 'container' 
  | 'card'
  | 'alert'
  | 'formContainer'
  | 'grid'
  | 'stack';

export interface EventHandler {
  type: 'submit' | 'navigate' | 'setState' | 'validate' | 'custom';
  action?: string;
  params?: Record<string, any>;
}

export interface UIComponent {
  id: string;
  type: ComponentType;
  props?: Record<string, any>;
  events?: Record<string, EventHandler>;
  children?: UIComponent[];
  layout?: {
    columns?: number;
    gap?: number;
    direction?: 'row' | 'column';
  };
}

export interface UISchema {
  version: string;
  root: UIComponent;
  metadata?: {
    title?: string;
    description?: string;
    framework?: string;
  };
}