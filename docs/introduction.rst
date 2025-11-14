Introduction
============

Promptius GUI is a JSON-driven React UI factory that can dynamically render UIs based on a JSON schema. It supports multiple UI frameworks like Material UI, Chakra UI, and Ant Design.

Features
--------

* **Multi-Framework Support**: Works seamlessly with Material UI, Chakra UI, and Ant Design
* **JSON Schema Driven**: Define UIs declaratively using a simple JSON schema
* **AI-Powered Generation**: Generate UI schemas from natural language prompts using LLMs
* **Type Safety**: Full TypeScript and Python type definitions with runtime validation
* **Dynamic Rendering**: Render complex UIs at runtime without code changes
* **Framework Agnostic**: Switch between UI frameworks without changing your schema
* **Language Support**: Generate code for multiple languages from a single schema
* **Event Handling**: Built-in support for user interactions and form submissions
* **Responsive Design**: Automatic responsive layouts and grid systems
* **Production Ready**: Battle-tested with FastAPI, React, and modern tooling

Architecture
------------

Promptius GUI uses a **JSON Schema-based code generation system** that eliminates code duplication and enables easy expansion to additional languages:

* **Single Source of Truth**: ``schema/promptius-gui-schema.json`` defines all UI components, props, and events
* **Multi-Language Generation**: Automatically generates type-safe code for Python (Pydantic) and TypeScript
* **Runtime Validation**: Full validation support with Pydantic (Python) and Zod (TypeScript)
* **Extensible**: Easy to add support for Go, Rust, Java, C#, and other languages

Generated Code
--------------

* **Python**: ``python/promptius_gui_schema/__init__.py`` - Pydantic models with validation
* **TypeScript**: ``js/packages/schemas/src/index.ts`` - Type definitions and interfaces
* **Zod**: ``js/packages/schemas/src/zod.ts`` - Runtime validation schemas (optional)

