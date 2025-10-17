#!/bin/bash

# Python Code Generation Script for DGUI Schema
# Generates Pydantic models from JSON Schema using AST-based approach

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SCHEMA_FILE="$PROJECT_ROOT/schema/dgui-schema.json"
OUTPUT_FILE="$PROJECT_ROOT/python/dgui_schema/__init__.py"

echo "🔧 Generating Python Pydantic models from JSON Schema using AST-based approach..."

# Check if schema file exists
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Schema file not found: $SCHEMA_FILE"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Generate Python code from JSON Schema using AST-based generator
echo "⚙️  Running AST-based Python generator..."
python3 "$SCRIPT_DIR/generate-python-ast.py" "$SCHEMA_FILE" "$OUTPUT_FILE"

echo "✅ Python code generation completed!"
echo "📁 Output: $OUTPUT_FILE"