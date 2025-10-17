#!/bin/bash

# Master Code Generation Script for DGUI Schema
# Generates both Python and TypeScript code from JSON Schema

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🚀 Starting DGUI Schema Code Generation..."
echo "📁 Project root: $PROJECT_ROOT"

# Check if schema file exists
SCHEMA_FILE="$PROJECT_ROOT/schema/dgui-schema.json"
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Schema file not found: $SCHEMA_FILE"
    echo "Please create the JSON Schema file first."
    exit 1
fi

echo "📋 Schema file found: $SCHEMA_FILE"

# Run Python generation
echo ""
echo "🐍 Generating Python code..."
"$SCRIPT_DIR/generate-python.sh"

# Run TypeScript generation
echo ""
echo "📘 Generating TypeScript code..."
"$SCRIPT_DIR/generate-typescript.sh"

# Run Zod generation (if requested)
if [ "$1" = "--with-zod" ]; then
    echo ""
    echo "🔍 Generating Zod schemas..."
    "$SCRIPT_DIR/generate-zod.sh"
fi

echo ""
echo "✅ All code generation completed successfully!"
echo ""
echo "📊 Summary:"
echo "  • Python Pydantic models: python/dgui_schema/__init__.py"
echo "  • TypeScript types: js/packages/schemas/src/index.ts"
if [ "$1" = "--with-zod" ]; then
    echo "  • Zod schemas: js/packages/schemas/src/zod.ts"
fi
echo ""
echo "💡 Next steps:"
echo "  • Run tests to verify generated code"
echo "  • Update imports in existing files"
echo "  • Remove old manual schema files"
