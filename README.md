# Promptius GUI - Dynamic UI Factory

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/AgentBossMode/promptius-gui)
[![npm version](https://img.shields.io/npm/v/@promptius-gui/core?logo=npm)](https://www.npmjs.com/package/@promptius-gui/core)
[![PyPI version](https://img.shields.io/pypi/v/promptius-gui-schema?logo=pypi)](https://pypi.org/project/promptius-gui-schema/)

This project is a JSON-driven React UI factory that can dynamically render UIs based on a JSON schema. It supports multiple UI frameworks like Material UI, Chakra UI, and Ant Design.

<div align="center">
  <img src="assets/tesla_sales.png" alt="Tesla Sales Example" width="45%" />
  <img src="assets/weather.png" alt="Weather Report Example" width="45%" />
</div>
<div align="center">
  <img src="assets/customer_report.png" alt="Customer satisfaction report" width="45%" />
  <img src="assets/covid.png" alt="Covid report" width="45%" />
</div>

## Features

- 🎨 **Multi-Framework Support**: Works seamlessly with Material UI, Chakra UI, and Ant Design
- 📝 **JSON Schema Driven**: Define UIs declaratively using a simple JSON schema
- 🤖 **AI-Powered Generation**: Generate UI schemas from natural language prompts using LLMs
- 🔒 **Type Safety**: Full TypeScript and Python type definitions with runtime validation
- ⚡ **Dynamic Rendering**: Render complex UIs at runtime without code changes
- 🔄 **Framework Agnostic**: Switch between UI frameworks without changing your schema
- 📦 **Language Support**: Generate code for multiple languages from a single schema
- 🎯 **Event Handling**: Built-in support for user interactions and form submissions
- 📱 **Responsive Design**: Automatic responsive layouts and grid systems
- 🚀 **Production Ready**: Battle-tested with FastAPI, React, and modern tooling

## Architecture

Promptius GUI uses a **JSON Schema-based code generation system** that eliminates code duplication and enables easy expansion to additional languages:

- **Single Source of Truth**: `schema/promptius-gui-schema.json` defines all UI components, props, and events
- **Multi-Language Generation**: Automatically generates type-safe code for Python (Pydantic) and TypeScript
- **Runtime Validation**: Full validation support with Pydantic (Python) and Zod (TypeScript)
- **Extensible**: Easy to add support for Go, Rust, Java, C#, and other languages

### Generated Code

- **Python**: `python/promptius_gui_schema/__init__.py` - Pydantic models with validation
- **TypeScript**: `js/packages/schemas/src/index.ts` - Type definitions and interfaces
- **Zod**: `js/packages/schemas/src/zod.ts` - Runtime validation schemas (optional)

## Quick Start

### Backend Setup (Python + FastAPI + LangChain)

#### 1. Install Packages

Install `promptius-gui-schema` and dependencies:

```bash
pip install promptius-gui-schema fastapi uvicorn langchain-openai python-dotenv
```

For development from source:

```bash
cd python
pip install -e ".[dev]"
```

#### 2. Create Your FastAPI Server

Create a `server.py` file (see `python/server.py` for reference):

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv

from promptius_gui_schema import PromptiusGuiSchema
import uvicorn

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LangChain with structured output
llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
llm_with_struct = llm.with_structured_output(PromptiusGuiSchema)

class GenerateUIRequest(BaseModel):
    prompt: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/generate_ui")
def generate_ui(request: GenerateUIRequest):
    """
    Generates a UI schema based on the user's prompt.
    Returns the schema as JSON using model_dump().
    """
    print("Received prompt:", request.prompt)
    answer: PromptiusGuiSchema = llm_with_struct.invoke([
        SystemMessage(content="You are a UI generator, you are required to generate UI, even if user is not providing sufficient data you are supposed to generate mock values. Keep the styling compact, use grid when required. You need to ensure that the UI looks good, think like a graphic designer"),
        HumanMessage(content=request.prompt)
    ])
    print("Generated UI Schema:", answer)
    # Use model_dump() to convert Pydantic model to dict for JSON response
    return answer.model_dump()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### 3. Set Up Environment Variables

Create a `.env` file in your project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

#### 4. Run the Server

```bash
python server.py
```

Or using uvicorn directly:

```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

The server will be available at `http://localhost:8000`.

### Frontend Setup (React + TypeScript)

#### 1. Install the Packages

Install the required packages from npm:

```bash
npm install @promptius-gui/core @promptius-gui/schemas
```

Install the UI framework adapters you want to use:

```bash
npm install @promptius-gui/material-ui
# or
npm install @promptius-gui/chakra-ui
# or
npm install @promptius-gui/ant-design
```

Or install all adapters at once:

```bash
npm install @promptius-gui/core @promptius-gui/schemas @promptius-gui/material-ui @promptius-gui/chakra-ui @promptius-gui/ant-design
```

#### 2. Use the Schema in Your Frontend

Import and register the adapters you need, then use `UIFactory` to render schemas from your backend:

```typescript
import UIFactory from '@promptius-gui/core';
import '@promptius-gui/material-ui'; // Register the material-ui adapter
// import '@promptius-gui/chakra-ui';
// import '@promptius-gui/ant-design';

// Fetch schema from backend (returns model_dump() output)
const response = await fetch('http://localhost:8000/generate_ui', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'A modern login form with email and password' }),
});

const schema = await response.json();

// Render the UI
<UIFactory schema={schema} />
```

#### 3. Set Up Your React Project (Optional)

If starting a new project:

```bash
# With Vite (recommended)
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm install @promptius-gui/core @promptius-gui/schemas @promptius-gui/material-ui
```

## Reference Implementation

- **Backend**: See `python/server.py` for complete FastAPI + LangChain example
- **Frontend**: See `js/demos/index.tsx` for complete React demo with multiple adapters

## Development

### Generate Code from Schema

To regenerate Python and TypeScript code from the JSON schema:

```bash
./scripts/generate-all.sh
```

### Python Development

```bash
cd python
make setup    # Install dependencies and generate code
make dev      # Start development server (if configured)
```

### Frontend Development

```bash
cd js
npm install
npm run dev
```

## License

See LICENSE file for details.
