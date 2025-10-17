# DGUI - Dynamic UI Factory

This project is a JSON-driven React UI factory that can dynamically render UIs based on a JSON schema. It supports multiple UI frameworks like Material UI, Chakra UI, and Ant Design.

## Architecture

DGUI uses a **JSON Schema-based code generation system** that eliminates code duplication and enables easy expansion to additional languages:

- **Single Source of Truth**: `schema/dgui-schema.json` defines all UI components, props, and events
- **Multi-Language Generation**: Automatically generates type-safe code for Python (Pydantic) and TypeScript
- **Runtime Validation**: Full validation support with Pydantic (Python) and Zod (TypeScript)
- **Extensible**: Easy to add support for Go, Rust, Java, C#, and other languages

### Generated Code

- **Python**: `python/dgui_schema/__init__.py` - Pydantic models with validation
- **TypeScript**: `js/packages/schemas/src/index.ts` - Type definitions and interfaces
- **Zod**: `js/packages/schemas/src/zod.ts` - Runtime validation schemas (optional)

## Quick Start

### Development Setup

1. **Generate Code from Schema**:
   ```bash
   ./scripts/generate-all.sh
   ```

2. **Start Development Server**:
   ```bash
   cd js
   npm install
   npm run dev
   ```

3. **Watch Mode** (auto-regenerate on schema changes):
   ```bash
   npm run generate:watch
   ```

### Python Backend

```bash
cd python
make setup  # Install dependencies and generate code
make dev    # Start development server
```

## How to run the project

1.  Navigate to the `js` directory:
    ```bash
    cd js
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

This will start the Vite development server and you can view the demo UI in your browser at the URL provided.
