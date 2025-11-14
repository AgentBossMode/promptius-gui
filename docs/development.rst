Development
===========

Generate Code from Schema
--------------------------

To regenerate Python and TypeScript code from the JSON schema:

.. code-block:: bash

   ./scripts/generate-all.sh

Python Development
-------------------

.. code-block:: bash

   cd python
   make setup    # Install dependencies and generate code
   make dev      # Start development server (if configured)

Frontend Development
--------------------

.. code-block:: bash

   cd js
   npm install
   npm run dev

Reference Implementation
-------------------------

* **Backend**: See ``python/server.py`` for complete FastAPI + LangChain example
* **Frontend**: See ``js/demos/index.tsx`` for complete React demo with multiple adapters

