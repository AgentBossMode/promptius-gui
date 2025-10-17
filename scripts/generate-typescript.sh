#!/bin/bash

# TypeScript Code Generation Script for Promptius GUI Schema
# Generates TypeScript types from JSON Schema

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SCHEMA_FILE="$PROJECT_ROOT/schema/promptius-gui-schema.json"
OUTPUT_FILE="$PROJECT_ROOT/js/packages/schemas/src/index.ts"

echo "🔧 Generating TypeScript types from JSON Schema..."

# Check if schema file exists
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Schema file not found: $SCHEMA_FILE"
    exit 1
fi

# Navigate to JS directory for npm install
cd "$PROJECT_ROOT/js"

# Install json-schema-to-typescript if not already installed
if ! npm list json-schema-to-typescript &> /dev/null; then
    echo "📦 Installing json-schema-to-typescript..."
    npm install --save-dev json-schema-to-typescript
fi

# Create output directory if it doesn't exist
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Generate TypeScript code from JSON Schema
echo "⚙️  Running json-schema-to-typescript..."
npx json-schema-to-typescript \
    "$SCHEMA_FILE" \
    --outFile "$OUTPUT_FILE" \
    --bannerComment "/* tslint:disable */" \
    --unreachableDefinitions \
    --noAdditionalProperties \
    --strictIndexSignatures \
    --enableConstEnums \
    --style.singleQuote \
    --style.semi \
    --style.trailingComma "es5" \
    --style.bracketSpacing \
    --style.printWidth 100

# Add custom header and organize exports
cat > "$OUTPUT_FILE.tmp" << 'EOF'
/**
 * Promptius GUI Schemas - Type definitions for UI component schemas
 * 
 * This file is auto-generated from schema/promptius-gui-schema.json
 * DO NOT EDIT MANUALLY - Use scripts/generate-typescript.sh to regenerate
 */

// ============================================================================
// Enums
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';
export type InputSize = 'sm' | 'md' | 'lg';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
export type AlignText = 'left' | 'center' | 'right' | 'justify';
export type FlexDirection = 'row' | 'column';
export type ChartType = 'bar' | 'line' | 'pie';

export type EventType = 'onClick' | 'onSubmit' | 'onChange' | 'onFocus' | 'onBlur';

// ============================================================================
// Event Actions (discriminated union)
// ============================================================================

export type NavigateAction = {
  type: 'navigate';
  url: string;
  target?: '_self' | '_blank';
};

export type SetStateAction = {
  type: 'setState';
  key: string;
  value: string | number | boolean;
};

export type SubmitFormAction = {
  type: 'submitForm';
  endpoint?: string;
  method?: 'POST' | 'PUT' | 'PATCH';
};

export type ValidateAction = {
  type: 'validate';
  rules?: string[];
};

export type CustomAction = {
  type: 'custom';
  handler: string;
};

export type EventAction = NavigateAction | SetStateAction | SubmitFormAction | ValidateAction | CustomAction;

export type ComponentType =
  | 'button'
  | 'input'
  | 'textarea'
  | 'text'
  | 'card'
  | 'alert'
  | 'container'
  | 'grid'
  | 'stack'
  | 'chart';

// ============================================================================
// Component Props
// ============================================================================

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

export interface InputProps {
  placeholder?: string;
  type?: InputType;
  size?: InputSize;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
  defaultValue?: string;
  maxLength?: number;
  minLength?: number;
}

export interface TextareaProps {
  placeholder?: string;
  rows?: number; // 1-20
  disabled?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
  maxLength?: number;
}

export interface TextProps {
  content: string;
  tag?: TextTag;
  align?: AlignText;
  bold?: boolean;
  italic?: boolean;
  color?: string; // validated in backend; allow string here
}

export interface CardProps {
  title?: string;
  description?: string;
  elevation?: number; // 0-5
  padding?: number; // px
}

export interface AlertProps {
  message: string;
  title?: string;
  variant?: AlertVariant;
  dismissible?: boolean;
}

export interface ContainerProps {
  maxWidth?: number; // 320-1920
  padding?: number; // 0-64
  centered?: boolean;
}

export interface GridProps {
  columns: number; // 1-12
  gap?: number; // 0-64 px
  responsive?: boolean;
}

export interface StackProps {
  direction?: FlexDirection;
  gap?: number; // 0-64 px
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export interface ChartSeries {
  name?: string;
  data: number[];
}

export interface ChartProps {
  chartType: ChartType;
  width?: number; // px
  height?: number; // px
  labels?: string[]; // for bar/line categories
  series: ChartSeries[]; // one or more series
  colors?: string[]; // optional custom colors
  title?: string;
  showLegend?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  xAxis?: {
    label?: string;
    ticks?: string[]; // default: labels
    showGrid?: boolean;
  };
  yAxis?: {
    label?: string;
    min?: number;
    max?: number;
    showGrid?: boolean;
  };
  annotations?: { x?: number; y?: number; label: string }[];
}

// ============================================================================
// Components (discriminated union members)
// ============================================================================

export interface BaseComponent<T extends ComponentType, P> {
  id: string;
  type: T;
  props: P;
}

export interface WithChildren<C = UIComponent> {
  children?: C[];
}

export type ButtonComponent = BaseComponent<'button', ButtonProps> & {
  events?: [EventType, EventAction][];
};

export type InputComponent = BaseComponent<'input', InputProps> & {
  events?: [EventType, EventAction][];
};

export type TextareaComponent = BaseComponent<'textarea', TextareaProps> & {
  events?: [EventType, EventAction][];
};

export type TextComponent = BaseComponent<'text', TextProps>;

export type CardComponent = BaseComponent<'card', CardProps> & WithChildren;

export type AlertComponent = BaseComponent<'alert', AlertProps>;

export type ContainerComponent = BaseComponent<'container', ContainerProps> & WithChildren;

export type GridComponent = BaseComponent<'grid', GridProps> & WithChildren;

export type StackComponent = BaseComponent<'stack', StackProps> & WithChildren;

export type ChartComponent = BaseComponent<'chart', ChartProps>;

export type UIComponent =
  | ButtonComponent
  | InputComponent
  | TextareaComponent
  | TextComponent
  | CardComponent
  | AlertComponent
  | ContainerComponent
  | GridComponent
  | StackComponent
  | ChartComponent;

// ============================================================================
// UISchema
// ============================================================================

export interface UIMetadata {
  title: string;
  description?: string;
  version?: string; // validated in backend
  framework?: 'shadcn' | 'material-ui' | 'chakra-ui' | 'ant-design';
}

export interface UISchema {
  metadata: UIMetadata;
  root: UIComponent;
}
EOF

# Replace the original file
mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"

echo "✅ TypeScript code generation completed!"
echo "📁 Output: $OUTPUT_FILE"
