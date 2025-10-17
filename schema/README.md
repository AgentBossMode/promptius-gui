# DGUI Schema System

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/AgentBossMode/DGUI)

This directory contains the JSON Schema-based code generation system for DGUI. The system uses a single JSON Schema definition as the source of truth to generate type-safe code for multiple programming languages.

## Overview

The DGUI Schema system eliminates code duplication by maintaining a single JSON Schema definition that automatically generates:

- **Python**: Pydantic models with full validation
- **TypeScript**: Type definitions and interfaces
- **Zod**: Runtime validation schemas (optional)

## Files

- `dgui-schema.json` - The single source of truth JSON Schema definition
- `../scripts/` - Code generation scripts for each language

## Usage

### Generate All Code

```bash
# Generate both Python and TypeScript code
./scripts/generate-all.sh

# Generate with Zod schemas for runtime validation
./scripts/generate-all.sh --with-zod
```

### Individual Language Generation

```bash
# Generate Python only
./scripts/generate-python.sh

# Generate TypeScript only
./scripts/generate-typescript.sh

# Generate Zod schemas only
./scripts/generate-zod.sh
```

### Watch Mode (Development)

```bash
# Watch for schema changes and auto-regenerate
npm run generate:watch
```

## Adding New Components

1. **Edit the JSON Schema**: Add your new component definition to `dgui-schema.json`
2. **Regenerate Code**: Run `./scripts/generate-all.sh`
3. **Update Tests**: Add tests for the new component
4. **Update Documentation**: Document the new component

### Example: Adding a New Component

```json
{
  "$defs": {
    "MyNewComponent": {
      "type": "object",
      "properties": {
        "type": { "const": "myNew" },
        "id": { "type": "string", "minLength": 1 },
        "props": { "$ref": "#/$defs/MyNewProps" }
      },
      "required": ["type", "id", "props"],
      "additionalProperties": false
    },
    "MyNewProps": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "enabled": { "type": "boolean", "default": true }
      },
      "required": ["title"],
      "additionalProperties": false
    }
  }
}
```

## Generated Output

### Python (`python/dgui_schema/__init__.py`)
- Pydantic v2 models with full validation
- Enum classes for type safety
- Field validators and constraints
- Auto-generated from JSON Schema

### TypeScript (`js/packages/schemas/src/index.ts`)
- Type definitions and interfaces
- Discriminated unions for type safety
- JSDoc comments from schema descriptions
- Auto-generated from JSON Schema

### Zod Schemas (`js/packages/schemas/src/zod.ts`) - Optional
- Runtime validation schemas
- Compatible with TypeScript types
- Auto-generated from JSON Schema

## Build Integration

### JavaScript/TypeScript
```json
{
  "scripts": {
    "generate": "../scripts/generate-all.sh",
    "generate:watch": "nodemon --watch ../schema/dgui-schema.json --exec \"../scripts/generate-all.sh\"",
    "prebuild": "npm run generate"
  }
}
```

### Python
```makefile
# Makefile
generate:
	../scripts/generate-python.sh

build: generate
	python -m build
```

## Adding Support for New Languages

The system is designed to easily add support for additional languages:

### Go
```bash
# Add to scripts/generate-go.sh
go-jsonschema -p main -o generated.go schema/dgui-schema.json
```

### Rust
```bash
# Add to scripts/generate-rust.sh
schemafy schema/dgui-schema.json > src/schema.rs
```

### Java
```bash
# Add to scripts/generate-java.sh
jsonschema2pojo -s schema/dgui-schema.json -t src/main/java
```

## Schema Structure

The JSON Schema follows a hierarchical structure:

1. **Enums**: String literal types for variants
2. **Event Actions**: Discriminated unions for event handling
3. **Component Props**: Type-safe property definitions
4. **Components**: Discriminated unions for UI components
5. **Top-level Schema**: Complete UI schema with metadata

## Validation

The generated code includes:

- **Runtime validation** (Python Pydantic, TypeScript Zod)
- **Compile-time type checking** (TypeScript)
- **Field constraints** (min/max, patterns, required fields)
- **Discriminated unions** for type safety

## Development Workflow

1. **Schema Changes**: Edit `dgui-schema.json`
2. **Auto-generation**: Run `./scripts/generate-all.sh`
3. **Testing**: Verify generated code works correctly
4. **Integration**: Update imports in existing code
5. **Documentation**: Update docs for new features

## Troubleshooting

### Common Issues

1. **Generation fails**: Check JSON Schema syntax
2. **Type mismatches**: Verify schema definitions
3. **Import errors**: Update import paths after generation
4. **Validation errors**: Check field constraints in schema

### Debug Mode

```bash
# Verbose generation output
DEBUG=1 ./scripts/generate-all.sh
```

## Contributing

When contributing to the schema:

1. **Test changes**: Always run generation after changes
2. **Update tests**: Add tests for new components
3. **Document changes**: Update this README
4. **Backward compatibility**: Consider impact on existing code

## Future Enhancements

- [ ] Add support for more languages (Go, Rust, Java, C#)
- [ ] Improve error messages in generated code
- [ ] Add schema validation tools
- [ ] Create IDE extensions for schema editing
- [ ] Add automated testing for generated code
