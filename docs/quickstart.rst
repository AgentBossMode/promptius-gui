Quick Start
===========

Backend Setup (Python + FastAPI + LangChain)
--------------------------------------------

1. Create Your FastAPI Server
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Create a ``server.py`` file:

.. code-block:: python

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

2. Set Up Environment Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Create a ``.env`` file in your project root:

.. code-block:: env

   OPENAI_API_KEY=your_openai_api_key_here

3. Run the Server
~~~~~~~~~~~~~~~~~

.. code-block:: bash

   python server.py

Or using uvicorn directly:

.. code-block:: bash

   uvicorn server:app --host 0.0.0.0 --port 8000 --reload

The server will be available at ``http://localhost:8000``.

Frontend Setup (React + TypeScript)
------------------------------------

1. Use the Schema in Your Frontend
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Import and register the adapters you need, then use ``UIFactory`` to render schemas from your backend:

.. code-block:: typescript

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

2. Set Up Your React Project (Optional)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If starting a new project:

.. code-block:: bash

   # With Vite (recommended)
   npm create vite@latest my-app -- --template react-ts
   cd my-app
   npm install
   npm install @promptius-gui/core @promptius-gui/schemas @promptius-gui/material-ui

