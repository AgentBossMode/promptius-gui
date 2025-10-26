#!/bin/bash

# Zod Schema Generation Script for Promptius GUI Schema
# Generates Zod schemas for runtime validation alongside TypeScript types

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SCHEMA_FILE="$PROJECT_ROOT/schema/promptius-gui-schema.json"
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

# Generate Zod schemas from JSON Schema using Node.js script
echo "⚙️  Using json-schema-to-zod to convert JSON Schema..."

# Run the Node.js generation script
node "$SCRIPT_DIR/generate-zod.mjs"

echo "✅ Zod schema generation completed!"
echo "📁 Output: $OUTPUT_FILE"
