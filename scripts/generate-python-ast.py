#!/usr/bin/env python3
"""
AST-based Python code generator for DGUI Schema
Generates clean, well-structured Pydantic models from JSON Schema
"""

import json
import ast
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional, Union


class PythonCodeGenerator:
    def __init__(self, schema_file: str, output_file: str):
        self.schema_file = Path(schema_file)
        self.output_file = Path(output_file)
        self.schema = self._load_schema()
        
    def _load_schema(self) -> Dict[str, Any]:
        """Load and parse the JSON Schema file"""
        with open(self.schema_file, 'r') as f:
            return json.load(f)
    
    def _get_enum_values(self, enum_def: Dict[str, Any]) -> List[str]:
        """Extract enum values from schema definition"""
        return enum_def.get('enum', [])
    
    def _get_property_type(self, prop_def: Dict[str, Any]) -> str:
        """Convert JSON Schema type to Python type annotation"""
        if 'oneOf' in prop_def:
            # Handle discriminated unions
            return 'Union[' + ', '.join([self._get_property_type(sub) for sub in prop_def['oneOf']]) + ']'
        elif 'type' in prop_def:
            if prop_def['type'] == 'string':
                if 'enum' in prop_def:
                    return f"Literal[{', '.join([repr(v) for v in prop_def['enum']])}]"
                return 'str'
            elif prop_def['type'] == 'integer':
                return 'int'
            elif prop_def['type'] == 'number':
                return 'float'
            elif prop_def['type'] == 'boolean':
                return 'bool'
            elif prop_def['type'] == 'array':
                item_type = self._get_property_type(prop_def.get('items', {'type': 'string'}))
                return f'List[{item_type}]'
            elif prop_def['type'] == 'object':
                return 'Dict[str, Any]'
        elif '$ref' in prop_def:
            # Handle references to other definitions
            ref_name = prop_def['$ref'].split('/')[-1]
            # Handle forward references
            if ref_name == 'UIComponent':
                return "'UIComponent'"
            return ref_name
        return 'Any'
    
    def _get_field_default(self, prop_def: Dict[str, Any]) -> Optional[str]:
        """Get default value for a field"""
        if 'default' in prop_def:
            default_val = prop_def['default']
            if isinstance(default_val, str):
                return f'"{default_val}"'
            elif isinstance(default_val, bool):
                return str(default_val)
            elif isinstance(default_val, (int, float)):
                return str(default_val)
            elif default_val is None:
                return 'None'
        return None
    
    def _get_field_constraints(self, prop_def: Dict[str, Any]) -> List[str]:
        """Generate field constraints for Pydantic"""
        constraints = []
        
        if 'minLength' in prop_def:
            constraints.append(f'min_length={prop_def["minLength"]}')
        if 'maxLength' in prop_def:
            constraints.append(f'max_length={prop_def["maxLength"]}')
        if 'minimum' in prop_def:
            constraints.append(f'ge={prop_def["minimum"]}')
        if 'maximum' in prop_def:
            constraints.append(f'le={prop_def["maximum"]}')
        if 'pattern' in prop_def:
            constraints.append(f'pattern=r"{prop_def["pattern"]}"')
        if 'minItems' in prop_def:
            constraints.append(f'min_length={prop_def["minItems"]}')
        if 'maxItems' in prop_def:
            constraints.append(f'max_length={prop_def["maxItems"]}')
            
        return constraints
    
    def generate_enum(self, name: str, enum_def: Dict[str, Any]) -> str:
        """Generate Python enum class"""
        values = self._get_enum_values(enum_def)
        description = enum_def.get('description', '')
        
        lines = [
            f'class {name}(Enum):',
            f'    """{description}"""' if description else '',
            ''
        ]
        
        for value in values:
            lines.append(f'    {value.upper().replace("-", "_")} = "{value}"')
        
        return '\n'.join(filter(None, lines))
    
    def generate_model(self, name: str, model_def: Dict[str, Any]) -> str:
        """Generate Pydantic model class"""
        properties = model_def.get('properties', {})
        required = set(model_def.get('required', []))
        description = model_def.get('description', '')
        
        lines = [
            f'class {name}(BaseModel):',
            f'    """{description}"""' if description else '',
            ''
        ]
        
        # Generate fields
        for field_name, field_def in properties.items():
            field_type = self._get_property_type(field_def)
            is_optional = field_name not in required
            default_val = self._get_field_default(field_def)
            constraints = self._get_field_constraints(field_def)
            
            # Handle special cases for type field
            if field_name == 'type' and 'const' in field_def:
                field_type = f"Literal['{field_def['const']}']"
            elif field_name == 'events' and '$ref' in field_def and 'EventBinding' in field_def['$ref']:
                # Fix events field to use proper EventBinding type
                field_type = "Optional[List[EventBinding]]"
            
            # Build field annotation
            if constraints:
                # Use Field() with constraints
                field_args = constraints.copy()
                if default_val is not None:
                    field_args.append(f'default={default_val}')
                elif is_optional:
                    field_args.append('default=None')
                
                field_annotation = f'Annotated[{field_type}, Field({", ".join(field_args)})]'
            else:
                # Simple field without constraints
                if is_optional and default_val is None:
                    field_annotation = f'Optional[{field_type}] = None'
                elif is_optional and default_val is not None:
                    field_annotation = f'{field_type} = {default_val}'
                else:
                    field_annotation = field_type
            
            lines.append(f'    {field_name}: {field_annotation}')
        
        return '\n'.join(lines)
    
    def generate_code(self) -> str:
        """Generate complete Python code"""
        lines = [
            '"""',
            'DGUI Schema - Type-safe UI schema definitions for cross-platform UI generation.',
            '',
            'This package provides robust, type-safe UI schema definitions that can be used',
            'to generate UI components across different frameworks (React, Vue, Angular, etc.)',
            'with full TypeScript compatibility.',
            '',
            'This file is auto-generated from schema/dgui-schema.json',
            'DO NOT EDIT MANUALLY - Use scripts/generate-python-ast.py to regenerate',
            '"""',
            '',
            '__version__ = "0.1.0"',
            '',
            'from typing import List, Literal, Optional, Union, Tuple, Dict, Any, Annotated',
            'from pydantic import BaseModel, Field',
            'from enum import Enum',
            ''
        ]
        
        # Generate enums first
        defs = self.schema.get('$defs', {})
        
        # Define enum order
        enum_order = [
            'ButtonVariant', 'ButtonSize', 'InputType', 'InputSize', 'AlertVariant',
            'TextTag', 'AlignText', 'FlexDirection', 'ChartType', 'EventType'
        ]
        
        for enum_name in enum_order:
            if enum_name in defs:
                lines.append(self.generate_enum(enum_name, defs[enum_name]))
                lines.append('')
        
        # Generate event actions
        action_order = [
            'NavigateAction', 'SetStateAction', 'SubmitFormAction', 
            'ValidateAction', 'CustomAction'
        ]
        
        for action_name in action_order:
            if action_name in defs:
                lines.append(self.generate_model(action_name, defs[action_name]))
                lines.append('')
        
        # Generate component props
        props_order = [
            'ButtonProps', 'InputProps', 'TextareaProps', 'TextProps', 'CardProps',
            'AlertProps', 'ContainerProps', 'GridProps', 'StackProps', 'ChartSeries',
            'AxisXProps', 'AxisYProps', 'ChartAnnotation', 'ChartProps'
        ]
        
        for prop_name in props_order:
            if prop_name in defs:
                lines.append(self.generate_model(prop_name, defs[prop_name]))
                lines.append('')
        
        
        # Generate union types first
        lines.extend([
            'EventAction = Union[',
            '    NavigateAction,',
            '    SetStateAction,',
            '    SubmitFormAction,',
            '    ValidateAction,',
            '    CustomAction,',
            ']',
            ''
        ])
        
        # Generate EventBinding after EventAction is defined
        if 'EventBinding' in defs:
            lines.append(self.generate_model('EventBinding', defs['EventBinding']))
            lines.append('')
        
        # Generate components after EventBinding
        component_order = [
            'ButtonComponent', 'InputComponent', 'TextareaComponent', 'TextComponent',
            'AlertComponent', 'CardComponent', 'ContainerComponent', 'GridComponent',
            'StackComponent', 'ChartComponent'
        ]
        
        for component_name in component_order:
            if component_name in defs:
                lines.append(self.generate_model(component_name, defs[component_name]))
                lines.append('')
        
        
        lines.extend([
            'UIComponent = Union[',
            '    ButtonComponent,',
            '    InputComponent,',
            '    TextareaComponent,',
            '    TextComponent,',
            '    CardComponent,',
            '    AlertComponent,',
            '    ContainerComponent,',
            '    GridComponent,',
            '    StackComponent,',
            '    ChartComponent,',
            ']',
            ''
        ])
        
        # Generate top-level schema
        if 'UIMetadata' in defs:
            lines.append(self.generate_model('UIMetadata', defs['UIMetadata']))
            lines.append('')
        
        # Generate UISchema manually
        lines.extend([
            'class UISchema(BaseModel):',
            '    """Complete UI schema definition"""',
            '    metadata: UIMetadata',
            '    root: UIComponent',
            '',
            '    def to_json(self) -> str:',
            '        """Export as JSON for frontend"""',
            '        return self.model_dump_json(indent=2, exclude_none=True)',
            ''
        ])
        
        # Add public API exports
        lines.extend([
            '# ============================================================================',
            '# PUBLIC API EXPORTS',
            '# ============================================================================',
            '',
            '__all__ = [',
            '    # Enums',
            '    "ButtonVariant", "ButtonSize", "InputType", "InputSize", "AlertVariant",',
            '    "TextTag", "AlignText", "FlexDirection", "ChartType", "EventType",',
            '    ',
            '    # Event Actions',
            '    "NavigateAction", "SetStateAction", "SubmitFormAction", "ValidateAction",',
            '    "CustomAction", "EventAction", "EventBinding",',
            '    ',
            '    # Component Props',
            '    "ButtonProps", "InputProps", "TextareaProps", "TextProps", "CardProps",',
            '    "AlertProps", "ContainerProps", "GridProps", "StackProps", "ChartSeries",',
            '    "AxisXProps", "AxisYProps", "ChartAnnotation", "ChartProps",',
            '    ',
            '    # Components',
            '    "ButtonComponent", "InputComponent", "TextareaComponent", "TextComponent",',
            '    "CardComponent", "AlertComponent", "ContainerComponent", "GridComponent",',
            '    "StackComponent", "ChartComponent", "UIComponent",',
            '    ',
            '    # Schema',
            '    "UIMetadata", "UISchema",',
            ']'
        ])
        
        return '\n'.join(lines)
    
    def generate(self):
        """Generate and write the Python code"""
        print(f"🔧 Generating Python code from {self.schema_file}")
        
        # Create output directory
        self.output_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Generate code
        code = self.generate_code()
        
        # Write to file
        with open(self.output_file, 'w') as f:
            f.write(code)
        
        print(f"✅ Python code generation completed!")
        print(f"📁 Output: {self.output_file}")


def main():
    if len(sys.argv) != 3:
        print("Usage: python generate-python-ast.py <schema_file> <output_file>")
        sys.exit(1)
    
    schema_file = sys.argv[1]
    output_file = sys.argv[2]
    
    generator = PythonCodeGenerator(schema_file, output_file)
    generator.generate()


if __name__ == '__main__':
    main()
