API Reference
=============

Python API
----------

Core Schema
~~~~~~~~~~~

.. autoclass:: promptius_gui_schema.PromptiusGuiSchema
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.UIMetadata
   :members:
   :undoc-members:

Components (Nodes)
~~~~~~~~~~~~~~~~~

UI components are represented as nodes in the schema. Each node has a unique ``id`` and specific props.

.. autoclass:: promptius_gui_schema.ButtonNode
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.InputNode
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.TextareaNode
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.TextNode
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.CardNode
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.AlertNode
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.ContainerNode
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.GridNode
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.StackNode
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.ChartNode
   :members:
   :undoc-members:

Component Props
~~~~~~~~~~~~~~~

Each component has specific props that define its appearance and behavior.

.. autoclass:: promptius_gui_schema.ButtonProps
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.InputProps
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.TextareaProps
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.TextProps
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.CardProps
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.AlertProps
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.ContainerProps
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.GridProps
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.StackProps
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.ChartProps
   :members:
   :undoc-members:

Events and Actions
~~~~~~~~~~~~~~~~~~

Events connect user interactions to actions.

.. autoclass:: promptius_gui_schema.Event
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.NavigateAction
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.SetStateAction
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.SubmitFormAction
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.ValidateAction
   :members:
   :undoc-members:

.. autoclass:: promptius_gui_schema.CustomAction
   :members:
   :undoc-members:

Structure
~~~~~~~~~

.. autoclass:: promptius_gui_schema.Edge
   :members:
   :undoc-members:

Enums
~~~~~

.. autoclass:: promptius_gui_schema.ButtonVariant
   :members:

.. autoclass:: promptius_gui_schema.ButtonSize
   :members:

.. autoclass:: promptius_gui_schema.InputType
   :members:

.. autoclass:: promptius_gui_schema.InputSize
   :members:

.. autoclass:: promptius_gui_schema.AlertVariant
   :members:

.. autoclass:: promptius_gui_schema.TextTag
   :members:

.. autoclass:: promptius_gui_schema.AlignText
   :members:

.. autoclass:: promptius_gui_schema.FlexDirection
   :members:

.. autoclass:: promptius_gui_schema.ChartType
   :members:

.. autoclass:: promptius_gui_schema.EventType
   :members:

.. autoclass:: promptius_gui_schema.Framework
   :members:

TypeScript API
--------------

The TypeScript API is available through the following packages:

* ``@promptius-gui/core`` - Core UI factory and rendering engine
* ``@promptius-gui/schemas`` - Type definitions and Zod schemas
* ``@promptius-gui/material-ui`` - Material UI adapter
* ``@promptius-gui/chakra-ui`` - Chakra UI adapter
* ``@promptius-gui/ant-design`` - Ant Design adapter

Core Package
~~~~~~~~~~~~

The core package provides the main ``UIFactory`` component:

.. code-block:: typescript

   import UIFactory from '@promptius-gui/core';
   import { PromptiusGUISchema } from '@promptius-gui/schemas';

   <UIFactory schema={schema} />

Schemas Package
~~~~~~~~~~~~~~~

The schemas package provides TypeScript type definitions and Zod validation schemas:

.. code-block:: typescript

   import { PromptiusGUISchema } from '@promptius-gui/schemas';
   import { promptiusGuiSchema } from '@promptius-gui/schemas/zod';

   // Type-safe schema
   const schema: PromptiusGUISchema = { ... };

   // Runtime validation
   const validated = promptiusGuiSchema.parse(schema);

