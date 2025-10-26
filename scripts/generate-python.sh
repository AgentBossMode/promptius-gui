#!/bin/bash

# Python Code Generation Script for Promptius GUI Schema
# Generates Pydantic models from JSON Schema using datamodel-code-generator
# with post-processing to fix oneOf issues by replacing RootModel with Union types

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SCHEMA_FILE="$PROJECT_ROOT/schema/promptius-gui-schema.json"
OUTPUT_FILE="$PROJECT_ROOT/python/promptius_gui_schema/__init__.py"
TEMP_FILE="$PROJECT_ROOT/python/promptius_gui_schema/__init__.py.temp"

echo "🔧 Generating Python Pydantic models from JSON Schema with oneOf fixes..."

# Check if schema file exists
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Schema file not found: $SCHEMA_FILE"
    exit 1
fi

# Check if datamodel-codegen is installed
if ! command -v datamodel-codegen &> /dev/null; then
    echo "❌ datamodel-codegen not found. Installing..."
    python3 -m pip install datamodel-code-generator
fi

# Create output directory if it doesn't exist
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Generate Python code from JSON Schema using datamodel-code-generator
echo "⚙️  Running datamodel-code-generator..."
datamodel-codegen \
    --input "$SCHEMA_FILE" \
    --input-file-type jsonschema \
    --output "$TEMP_FILE" \
    --output-model-type pydantic_v2.BaseModel \
    --target-python-version 3.9

echo "🔧 Post-processing to fix oneOf issues..."

# Post-process the generated file to replace RootModel with Union types
python3 "$SCRIPT_DIR/fix-python-oneof.py" "$TEMP_FILE" "$OUTPUT_FILE"

# Clean up temp file
rm "$TEMP_FILE"

echo "✅ Python code generation completed with oneOf fixes!"
echo "📁 Output: $OUTPUT_FILE"
