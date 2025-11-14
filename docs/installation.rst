Installation
============

Backend (Python)
----------------

Install ``promptius-gui-schema`` and dependencies:

.. code-block:: bash

   pip install promptius-gui-schema fastapi uvicorn langchain-openai python-dotenv

For development from source:

.. code-block:: bash

   cd python
   pip install -e ".[dev]"

Frontend (React + TypeScript)
-----------------------------

Install the required packages from npm:

.. code-block:: bash

   npm install @promptius-gui/core @promptius-gui/schemas

Install the UI framework adapters you want to use:

.. code-block:: bash

   npm install @promptius-gui/material-ui
   # or
   npm install @promptius-gui/chakra-ui
   # or
   npm install @promptius-gui/ant-design

Or install all adapters at once:

.. code-block:: bash

   npm install @promptius-gui/core @promptius-gui/schemas @promptius-gui/material-ui @promptius-gui/chakra-ui @promptius-gui/ant-design

