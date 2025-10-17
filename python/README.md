# DGUI Schema

[![PyPI version](https://badge.fury.io/py/dgui-schema.svg)](https://badge.fury.io/py/dgui-schema)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Type-safe UI schema definitions for cross-platform UI generation**

DGUI Schema provides robust, type-safe UI schema definitions that can be used to generate UI components across different frameworks (React, Vue, Angular, etc.) with full TypeScript compatibility.

## Features

- 🎯 **Type-Safe**: Built with Pydantic for runtime validation and type safety
- 🔄 **Cross-Platform**: Compatible with React, Vue, Angular, and other frameworks
- 📝 **TypeScript Compatible**: Full TypeScript definitions available
- 🎨 **Framework Agnostic**: Works with shadcn/ui, Material-UI, Chakra UI, Ant Design
- 🚀 **Zero Dependencies**: Only requires Pydantic (no heavy framework dependencies)
- 📦 **Lightweight**: Minimal package size for maximum performance

## Installation

```bash
pip install dgui-schema
```

## Quick Start

```python
from dgui_schema import UISchema, UIMetadata, ButtonComponent, ButtonProps, ButtonVariant

# Create a simple button schema
schema = UISchema(
    metadata=UIMetadata(
        title="My App",
        description="A simple application",
        framework="shadcn"
    ),
    root=ButtonComponent(
        id="submit-btn",
        props=ButtonProps(
            label="Submit",
            variant=ButtonVariant.PRIMARY
        )
    )
)

# Export as JSON for frontend consumption
json_schema = schema.to_json()
print(json_schema)
```

## Supported Components

### Layout Components
- **Container**: Responsive container with max-width and padding
- **Grid**: Flexible grid layout with configurable columns
- **Stack**: Vertical or horizontal stack layout

### Form Components
- **Button**: Interactive buttons with variants and states
- **Input**: Text inputs with validation and helper text
- **Textarea**: Multi-line text input with configurable rows

### Display Components
- **Text**: Typography with semantic tags and styling
- **Card**: Content containers with elevation and padding
- **Alert**: Notifications with different severity levels
- **Chart**: Data visualization with multiple chart types

## Framework Support

| Framework | Status | Notes |
|-----------|--------|-------|
| **shadcn/ui** | ✅ Full Support | Default framework |
| **Material-UI** | ✅ Full Support | Complete component mapping |
| **Chakra UI** | ✅ Full Support | All components supported |
| **Ant Design** | ✅ Full Support | Enterprise-ready components |

## Advanced Usage

### Event Handling

```python
from dgui_schema import (
    EventType, SetStateAction, SubmitFormAction, 
    NavigateAction, EventBinding
)

# Button with click event
button = ButtonComponent(
    id="submit-btn",
    props=ButtonProps(label="Submit"),
    events=[
        (EventType.CLICK, SubmitFormAction(
            type="submitForm",
            endpoint="/api/submit",
            method="POST"
        ))
    ]
)
```

### Complex Layouts

```python
from dgui_schema import (
    ContainerComponent, ContainerProps,
    GridComponent, GridProps,
    CardComponent, CardProps,
    TextComponent, TextProps, TextTag
)

# Dashboard layout
dashboard = UISchema(
    metadata=UIMetadata(title="Dashboard", framework="material-ui"),
    root=ContainerComponent(
        id="dashboard",
        props=ContainerProps(maxWidth=1200, padding=24),
        children=[
            GridComponent(
                id="metrics-grid",
                props=GridProps(columns=3, gap=16),
                children=[
                    CardComponent(
                        id="users-card",
                        props=CardProps(title="Total Users"),
                        children=[
                            TextComponent(
                                id="users-count",
                                props=TextProps(
                                    content="12,345",
                                    tag=TextTag.H2
                                )
                            )
                        ]
                    )
                ]
            )
        ]
    )
)
```

### Chart Components

```python
from dgui_schema import (
    ChartComponent, ChartProps, ChartType, ChartSeries
)

# Bar chart
chart = ChartComponent(
    id="sales-chart",
    props=ChartProps(
        chartType=ChartType.BAR,
        title="Sales Data",
        series=[
            ChartSeries(name="Q1", data=[100, 200, 150]),
            ChartSeries(name="Q2", data=[120, 180, 200])
        ],
        labels=["Jan", "Feb", "Mar"]
    )
)
```

## TypeScript Integration

The package is designed to work seamlessly with TypeScript. The corresponding TypeScript definitions are available in the main DGUI repository:

```typescript
import { UISchema, ButtonComponent, ButtonProps } from '@dgui/schemas';

const schema: UISchema = {
  metadata: {
    title: "My App",
    framework: "shadcn"
  },
  root: {
    type: "button",
    id: "submit-btn",
    props: {
      label: "Submit",
      variant: "primary"
    }
  }
};
```

## Validation

All schemas are validated at runtime using Pydantic:

```python
from dgui_schema import UISchema, UIMetadata, ButtonComponent, ButtonProps

try:
    # This will raise a validation error
    invalid_schema = UISchema(
        metadata=UIMetadata(title=""),  # Empty title not allowed
        root=ButtonComponent(
            id="btn",
            props=ButtonProps(label="")  # Empty label not allowed
        )
    )
except ValidationError as e:
    print(f"Validation failed: {e}")
```

## Development

### Installation for Development

```bash
git clone https://github.com/kanishkgupta2000/DGUI.git
cd DGUI/python
pip install -e .
```

### Running Tests

```bash
pip install -e ".[dev]"
pytest
```

### Code Formatting

```bash
black dgui_schema/
isort dgui_schema/
```

## API Reference

### Core Classes

- **`UISchema`**: Top-level schema container
- **`UIMetadata`**: Schema metadata and framework information
- **`UIComponent`**: Union type for all component types

### Component Types

- **Layout**: `ContainerComponent`, `GridComponent`, `StackComponent`
- **Form**: `ButtonComponent`, `InputComponent`, `TextareaComponent`
- **Display**: `TextComponent`, `CardComponent`, `AlertComponent`, `ChartComponent`

### Event System

- **Event Types**: `EventType` enum (CLICK, SUBMIT, CHANGE, etc.)
- **Actions**: `NavigateAction`, `SetStateAction`, `SubmitFormAction`, etc.
- **Binding**: Tuple format `(EventType, EventAction)` for TypeScript compatibility

## Contributing

Contributions are welcome! Please read our [Contributing Guide](https://github.com/kanishkgupta2000/DGUI/blob/main/CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [DGUI Core](https://github.com/kanishkgupta2000/DGUI) - Main DGUI repository
- [DGUI React](https://github.com/kanishkgupta2000/DGUI/tree/main/js/packages/core) - React renderer
- [DGUI Vue](https://github.com/kanishkgupta2000/DGUI) - Vue renderer (coming soon)

## Support

- 📖 [Documentation](https://github.com/kanishkgupta2000/DGUI#readme)
- 🐛 [Issue Tracker](https://github.com/kanishkgupta2000/DGUI/issues)
- 💬 [Discussions](https://github.com/kanishkgupta2000/DGUI/discussions)
