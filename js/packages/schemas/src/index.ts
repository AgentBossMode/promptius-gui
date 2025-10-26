/* tslint:disable */

/**
 * A UI component node with unique ID, type, and props
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "Node".
 */
export type Node =
  | ButtonNode
  | InputNode
  | TextareaNode
  | TextNode
  | CardNode
  | AlertNode
  | ContainerNode
  | GridNode
  | StackNode
  | ChartNode;
/**
 * Event handler type
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "EventType".
 */
export type EventType = 'onClick' | 'onSubmit' | 'onChange' | 'onFocus' | 'onBlur';
/**
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "EventAction".
 */
export type EventAction =
  | NavigateAction
  | SetStateAction
  | SubmitFormAction
  | ValidateAction
  | CustomAction;
/**
 * Button visual variant
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "ButtonVariant".
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
/**
 * Button size variant
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "ButtonSize".
 */
export type ButtonSize = 'sm' | 'md' | 'lg';
/**
 * HTML input type
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "InputType".
 */
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date';
/**
 * Input size variant
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "InputSize".
 */
export type InputSize = 'sm' | 'md' | 'lg';
/**
 * Alert visual variant
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "AlertVariant".
 */
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
/**
 * HTML tag for text component
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "TextTag".
 */
export type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
/**
 * Text alignment
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "AlignText".
 */
export type AlignText = 'left' | 'center' | 'right' | 'justify';
/**
 * Flexbox direction
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "FlexDirection".
 */
export type FlexDirection = 'row' | 'column';
/**
 * Chart visualization type
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "ChartType".
 */
export type ChartType = 'bar' | 'line' | 'pie';

/**
 * Type-safe UI schema definitions for cross-platform UI generation using graph-based structure
 */
export interface PromptiusGUISchema {
  metadata: UIMetadata;
  /**
   * Array of UI component nodes
   */
  nodes: Node[];
  /**
   * Array of parent-child relationships
   */
  edges?: Edge[];
  /**
   * Array of event bindings
   */
  events?: Event[];
}
/**
 * Metadata for the UI schema
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "UIMetadata".
 */
export interface UIMetadata {
  /**
   * UI schema title
   */
  title: string;
  /**
   * UI schema description
   */
  description?: string;
  /**
   * Schema version
   */
  version?: string;
  /**
   * Target UI framework
   */
  framework?: 'shadcn' | 'material-ui' | 'chakra-ui' | 'ant-design';
  /**
   * ID of the root node to start rendering from
   */
  rootId: string;
}
/**
 * Button node
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "ButtonNode".
 */
export interface ButtonNode {
  /**
   * Unique node identifier
   */
  id: string;
  type: 'button';
  props: ButtonProps;
}
/**
 * Type-safe props for Button component
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "ButtonProps".
 */
export interface ButtonProps {
  /**
   * Button text
   */
  label: string;
  /**
   * Button visual variant
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  /**
   * Button size variant
   */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}
/**
 * Input node
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "InputNode".
 */
export interface InputNode {
  /**
   * Unique node identifier
   */
  id: string;
  type: 'input';
  props: InputProps;
}
/**
 * Type-safe props for Input component
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "InputProps".
 */
export interface InputProps {
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * HTML input type
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';
  /**
   * Input size variant
   */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  required?: boolean;
  /**
   * Input label
   */
  label?: string;
  /**
   * Helper text below input
   */
  helperText?: string;
  /**
   * Default input value
   */
  defaultValue?: string;
  /**
   * Maximum input length
   */
  maxLength?: number;
  /**
   * Minimum input length
   */
  minLength?: number;
}
/**
 * Textarea node
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "TextareaNode".
 */
export interface TextareaNode {
  /**
   * Unique node identifier
   */
  id: string;
  type: 'textarea';
  props: TextareaProps;
}
/**
 * Type-safe props for Textarea component
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "TextareaProps".
 */
export interface TextareaProps {
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Number of textarea rows
   */
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  /**
   * Textarea label
   */
  label?: string;
  /**
   * Helper text below textarea
   */
  helperText?: string;
  /**
   * Maximum textarea length
   */
  maxLength?: number;
}
/**
 * Text node
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "TextNode".
 */
export interface TextNode {
  /**
   * Unique node identifier
   */
  id: string;
  type: 'text';
  props: TextProps;
}
/**
 * Type-safe props for Text component
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "TextProps".
 */
export interface TextProps {
  /**
   * Text content
   */
  content: string;
  /**
   * HTML tag for text component
   */
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right' | 'justify';
  bold?: boolean;
  italic?: boolean;
  /**
   * Text color (hex or CSS color name)
   */
  color?: string;
}
/**
 * Card node
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "CardNode".
 */
export interface CardNode {
  /**
   * Unique node identifier
   */
  id: string;
  type: 'card';
  props: CardProps;
}
/**
 * Type-safe props for Card component
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "CardProps".
 */
export interface CardProps {
  /**
   * Card title
   */
  title?: string;
  /**
   * Card description
   */
  description?: string;
  /**
   * Card elevation level
   */
  elevation?: number;
  /**
   * Card padding in pixels
   */
  padding?: number;
}
/**
 * Alert node
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "AlertNode".
 */
export interface AlertNode {
  /**
   * Unique node identifier
   */
  id: string;
  type: 'alert';
  props: AlertProps;
}
/**
 * Type-safe props for Alert component
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "AlertProps".
 */
export interface AlertProps {
  /**
   * Alert message
   */
  message: string;
  /**
   * Alert title
   */
  title?: string;
  /**
   * Alert visual variant
   */
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
}
/**
 * Container node
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "ContainerNode".
 */
export interface ContainerNode {
  /**
   * Unique node identifier
   */
  id: string;
  type: 'container';
  props: ContainerProps;
}
/**
 * Type-safe props for Container component
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "ContainerProps".
 */
export interface ContainerProps {
  /**
   * Maximum container width in pixels
   */
  maxWidth?: number;
  /**
   * Container padding in pixels
   */
  padding?: number;
  centered?: boolean;
}
/**
 * Grid node
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "GridNode".
 */
export interface GridNode {
  /**
   * Unique node identifier
   */
  id: string;
  type: 'grid';
  props: GridProps;
}
/**
 * Type-safe props for Grid layout
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "GridProps".
 */
export interface GridProps {
  /**
   * Number of columns
   */
  columns: number;
  /**
   * Gap between items in pixels
   */
  gap?: number;
  /**
   * Enable responsive behavior
   */
  responsive?: boolean;
}
/**
 * Stack node
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "StackNode".
 */
export interface StackNode {
  /**
   * Unique node identifier
   */
  id: string;
  type: 'stack';
  props: StackProps;
}
/**
 * Type-safe props for Stack layout
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "StackProps".
 */
export interface StackProps {
  /**
   * Flexbox direction
   */
  direction?: 'row' | 'column';
  /**
   * Gap between items in pixels
   */
  gap?: number;
  /**
   * Alignment of items
   */
  align?: 'start' | 'center' | 'end' | 'stretch';
}
/**
 * Chart node
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "ChartNode".
 */
export interface ChartNode {
  /**
   * Unique node identifier
   */
  id: string;
  type: 'chart';
  props: ChartProps;
}
/**
 * Type-safe props for Chart component
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "ChartProps".
 */
export interface ChartProps {
  /**
   * Chart visualization type
   */
  chartType: 'bar' | 'line' | 'pie';
  /**
   * Chart width in pixels
   */
  width?: number;
  /**
   * Chart height in pixels
   */
  height?: number;
  /**
   * Chart category labels
   */
  labels?: string[];
  /**
   * Chart data series
   *
   * @minItems 1
   */
  series: [ChartSeries, ...ChartSeries[]];
  /**
   * Custom chart colors
   */
  colors?: string[];
  /**
   * Chart title
   */
  title?: string;
  showLegend?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  xAxis?: AxisXProps;
  yAxis?: AxisYProps;
  /**
   * Chart annotations
   */
  annotations?: ChartAnnotation[];
}
/**
 * Chart data series
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "ChartSeries".
 */
export interface ChartSeries {
  /**
   * Series name
   */
  name?: string;
  /**
   * Series data points
   *
   * @minItems 1
   */
  data: [number, ...number[]];
}
/**
 * X-axis configuration
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "AxisXProps".
 */
export interface AxisXProps {
  /**
   * X-axis label
   */
  label?: string;
  /**
   * X-axis tick labels
   */
  ticks?: string[];
  showGrid?: boolean;
}
/**
 * Y-axis configuration
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "AxisYProps".
 */
export interface AxisYProps {
  /**
   * Y-axis label
   */
  label?: string;
  /**
   * Y-axis minimum value
   */
  min?: number;
  /**
   * Y-axis maximum value
   */
  max?: number;
  showGrid?: boolean;
}
/**
 * Chart annotation
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "ChartAnnotation".
 */
export interface ChartAnnotation {
  /**
   * X coordinate
   */
  x?: number;
  /**
   * Y coordinate
   */
  y?: number;
  /**
   * Annotation label
   */
  label: string;
}
/**
 * Parent-child relationship between nodes
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "Edge".
 */
export interface Edge {
  /**
   * Parent node ID
   */
  src: string;
  /**
   * Child node ID
   */
  dest: string;
  /**
   * Rendering order among siblings
   */
  order: number;
}
/**
 * Event binding for a specific node
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "Event".
 */
export interface Event {
  /**
   * Node ID to bind event to
   */
  nodeId: string;
  eventType: EventType;
  action: EventAction;
}
/**
 * Navigate to a URL or route
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "NavigateAction".
 */
export interface NavigateAction {
  type: 'navigate';
  /**
   * URL or route to navigate to
   */
  url: string;
  /**
   * Navigation target window
   */
  target?: '_self' | '_blank';
}
/**
 * Update component state
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "SetStateAction".
 */
export interface SetStateAction {
  type: 'setState';
  /**
   * State key to update
   */
  key: string;
  /**
   * Value to set
   */
  value: string | number | boolean;
}
/**
 * Submit form data
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "SubmitFormAction".
 */
export interface SubmitFormAction {
  type: 'submitForm';
  /**
   * API endpoint to submit to
   */
  endpoint?: string;
  /**
   * HTTP method for form submission
   */
  method?: 'POST' | 'PUT' | 'PATCH';
}
/**
 * Validate form or input
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "ValidateAction".
 */
export interface ValidateAction {
  type: 'validate';
  /**
   * Validation rules
   */
  rules?: string[];
}
/**
 * Custom handler reference
 *
 * This interface was referenced by `PromptiusGUISchema`'s JSON-Schema
 * via the `definition` "CustomAction".
 */
export interface CustomAction {
  type: 'custom';
  /**
   * Name of custom handler function
   */
  handler: string;
}

// Export Zod schemas for runtime validation
export * from './zod';

// Export Zod schemas for runtime validation
export * from './zod';
