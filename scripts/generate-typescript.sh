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
    --bannerComment "/* tslint:disable */" \
    --unreachableDefinitions \
    --noAdditionalProperties \
    --strictIndexSignatures \
    --enableConstEnums \
    --style.singleQuote \
    --style.semi \
    --style.trailingComma "es5" \
    --style.bracketSpacing \
    --style.printWidth 100 > "$OUTPUT_FILE"

# Add Zod schema export to the generated file
echo "🔧 Adding Zod schema export..."
cat >> "$OUTPUT_FILE" << 'EOF'

// Export Zod schemas for runtime validation
export * from './zod';
EOF

echo "✅ TypeScript code generation completed!"
echo "📁 Output: $OUTPUT_FILE"
