Introduction
============

Promptius GUI is a JSON-driven React UI factory that can dynamically render UIs based on a JSON schema. It supports multiple UI frameworks like Material UI, Chakra UI, and Ant Design.

What Problem Are We Solving?
-----------------------------

Generative AI excels at creating text and code, but agents struggle to present rich, interactive interfaces to users, especially when those agents are remote or running across trust boundaries.

**Promptius-GUI** allows agents to "speak UI" by sending a declarative JSON format describing the intent of the UI. The client application then renders this using its own native component library (Material UI, Chakra UI, Ant Design, etc.).

This approach ensures that agent-generated UIs are **safe like data, but expressive like code**.

Why Graph Structure?
--------------------

The graph-based structure (nodes + edges) is an intentional design choice that enables **dramatic token efficiency** when using structured output:

* **Nested parent-child structure**: ~128k+ tokens when bound to Pydantic models
* **Graph structure (nodes/edges separate)**: ~4k tokens when bound to Pydantic models

This makes Promptius-GUI ideal for LLM integration with structured output tools like LangChain's ``with_structured_output()``, providing developers with type-safe, error-resistant UI generation.

The graph structure is not a limitation—it's the core feature that enables efficient structured output integration.

Structured Output Advantage
----------------------------

Unlike systems that depend on raw JSON parsing, Promptius-GUI is designed for structured output:

* **Pydantic models**: Direct binding to Python schema
* **Type safety**: Full TypeScript + Python type generation
* **Error resistance**: No JSON parsing errors
* **Developer preference**: Structured output is preferred over raw JSON

When you bind the schema to a Pydantic model for structured LLM output, you get:

* Guaranteed type safety at compile time
* Runtime validation with clear error messages
* No need to handle JSON parsing errors
* Seamless integration with LangChain, LlamaIndex, and other LLM frameworks

Use Cases
---------

Promptius-GUI is perfect for scenarios where agents need to generate dynamic, interactive UIs:

Dynamic Data Collection
~~~~~~~~~~~~~~~~~~~~~~~

An agent generates a bespoke form (date pickers, sliders, inputs) based on the specific context of a conversation. For example, booking a specialized reservation that requires custom fields based on the service type.

Remote Sub-Agents
~~~~~~~~~~~~~~~~~

An orchestrator agent delegates a task to a remote specialized agent (e.g., a travel booking agent) which returns a UI payload to be rendered inside the main chat window.

Adaptive Workflows
~~~~~~~~~~~~~~~~~~

Enterprise agents that generate approval dashboards or data visualizations on the fly based on the user's query. The UI adapts to the data structure and user requirements.

AI-Powered Forms
~~~~~~~~~~~~~~~~

LLMs can generate complex, multi-step forms with conditional logic based on natural language descriptions, without requiring developers to write form code.

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

Architecture Flow
~~~~~~~~~~~~~~~~~

.. mermaid::

   graph TB
       A[User Prompt] --> B[LLM with Structured Output]
       B --> C[Pydantic Model Binding]
       C --> D[PromptiusGuiSchema]
       D --> E[Graph Structure<br/>nodes + edges + events]
       E --> F[UIFactory Renderer]
       F --> G[Framework Adapter]
       G --> H[Material UI / Chakra UI / Ant Design]
       
       I[JSON Schema] --> J[Code Generation]
       J --> K[Python Pydantic Models]
       J --> L[TypeScript Types]
       J --> M[Zod Schemas]

The architecture follows this flow:

1. **User provides a prompt** describing the desired UI
2. **LLM with structured output** generates a schema using Pydantic model binding
3. **Graph structure** (nodes + edges + events) is created with minimal token usage (~4k tokens)
4. **UIFactory renderer** processes the graph structure
5. **Framework adapter** maps abstract components to concrete UI framework components
6. **Final UI** is rendered using the selected framework (Material UI, Chakra UI, etc.)

The code generation pipeline runs separately, automatically generating type-safe code from the JSON Schema.

Generated Code
--------------

* **Python**: ``python/promptius_gui_schema/__init__.py`` - Pydantic models with validation
* **TypeScript**: ``js/packages/schemas/src/index.ts`` - Type definitions and interfaces
* **Zod**: ``js/packages/schemas/src/zod.ts`` - Runtime validation schemas (optional)

Comparison with Alternatives
-----------------------------

Promptius-GUI is similar to other agent-to-UI frameworks like A2UI. Here's a fair comparison:

Token Efficiency & Structured Output
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Promptius-GUI** excels at:

* **Token efficiency**: ~4k tokens vs 128k+ for nested structures when using structured output
* **Structured output**: Native Pydantic/TypeScript integration with LangChain's ``with_structured_output()``
* **Type safety**: Full type generation from JSON Schema
* **Error resistance**: Type-safe structured output prevents JSON parsing errors
* **Multi-framework**: 4+ framework adapters (Material UI, Chakra UI, Ant Design, Shadcn)

**A2UI** excels at:

* **Incremental updates**: Native support for progressive UI building
* **Component catalog**: Explicit whitelist of allowed components for security
* **Smart Wrappers**: Custom components with security policies

When to Choose Promptius-GUI
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Choose Promptius-GUI if:

* Token efficiency and structured output are priorities
* You need type-safe integration with Pydantic models
* You want multi-framework support with easy switching
* You prefer structured output over raw JSON parsing
* You need full TypeScript and Python type generation

When to Choose A2UI
~~~~~~~~~~~~~~~~~~~

Choose A2UI if:

* Built-in incremental updates are essential
* Component catalog security model is required
* You need Smart Wrappers for custom components with sandboxing

Both projects solve similar problems with different tradeoffs. Promptius-GUI's graph structure is not a limitation but a feature—it enables token-efficient structured output integration, which is crucial for production LLM applications.

