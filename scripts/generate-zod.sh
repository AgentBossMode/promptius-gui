#!/bin/bash

# Zod Schema Generation Script for DGUI Schema
# Generates Zod schemas for runtime validation alongside TypeScript types

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SCHEMA_FILE="$PROJECT_ROOT/schema/dgui-schema.json"
OUTPUT_FILE="$PROJECT_ROOT/js/packages/schemas/src/zod.ts"

echo "🔍 Generating Zod schemas from JSON Schema..."

# Check if schema file exists
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Schema file not found: $SCHEMA_FILE"
    exit 1
fi

# Navigate to JS directory for npm install
cd "$PROJECT_ROOT/js"

# Install json-schema-to-zod if not already installed
if ! npm list json-schema-to-zod &> /dev/null; then
    echo "📦 Installing json-schema-to-zod..."
    npm install --save-dev json-schema-to-zod
fi

# Create output directory if it doesn't exist
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Generate Zod schemas from JSON Schema
echo "⚙️  Running json-schema-to-zod..."
npx json-schema-to-zod \
    "$SCHEMA_FILE" \
    --outFile "$OUTPUT_FILE" \
    --bannerComment "/* tslint:disable */" \
    --style.singleQuote \
    --style.semi \
    --style.trailingComma "es5" \
    --style.bracketSpacing \
    --style.printWidth 100

# Add custom header and organize exports
cat > "$OUTPUT_FILE.tmp" << 'EOF'
/**
 * DGUI Zod Schemas - Runtime validation schemas for UI components
 * 
 * This file is auto-generated from schema/dgui-schema.json
 * DO NOT EDIT MANUALLY - Use scripts/generate-zod.sh to regenerate
 */

import { z } from 'zod';

// ============================================================================
// Base Zod Schemas
// ============================================================================

EOF

# Append the generated content (skip the first few lines that are imports)
tail -n +10 "$OUTPUT_FILE" >> "$OUTPUT_FILE.tmp"

# Replace the original file
mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"

# Add the public API exports at the end
cat >> "$OUTPUT_FILE" << 'EOF'

// ============================================================================
// PUBLIC API EXPORTS
// ============================================================================

export {
  // Enums
  ButtonVariantSchema,
  ButtonSizeSchema,
  InputTypeSchema,
  InputSizeSchema,
  AlertVariantSchema,
  TextTagSchema,
  AlignTextSchema,
  FlexDirectionSchema,
  ChartTypeSchema,
  EventTypeSchema,
  
  // Event Actions
  NavigateActionSchema,
  SetStateActionSchema,
  SubmitFormActionSchema,
  ValidateActionSchema,
  CustomActionSchema,
  EventActionSchema,
  
  // Component Props
  ButtonPropsSchema,
  InputPropsSchema,
  TextareaPropsSchema,
  TextPropsSchema,
  CardPropsSchema,
  AlertPropsSchema,
  ContainerPropsSchema,
  GridPropsSchema,
  StackPropsSchema,
  ChartSeriesSchema,
  AxisXPropsSchema,
  AxisYPropsSchema,
  ChartAnnotationSchema,
  ChartPropsSchema,
  
  // Components
  ButtonComponentSchema,
  InputComponentSchema,
  TextareaComponentSchema,
  TextComponentSchema,
  CardComponentSchema,
  AlertComponentSchema,
  ContainerComponentSchema,
  GridComponentSchema,
  StackComponentSchema,
  ChartComponentSchema,
  UIComponentSchema,
  
  // Schema
  UIMetadataSchema,
  UISchemaSchema,
};
EOF

echo "✅ Zod schema generation completed!"
echo "📁 Output: $OUTPUT_FILE"
