#!/usr/bin/env python3
"""
Post-process generated Python code to replace RootModel with Union type aliases
This fixes the oneOf issue in JSON schema generation
"""

import re
import sys
from pathlib import Path


def remove_extra_forbid_config(content):
    """Remove ConfigDict(extra='forbid') from all model classes"""
    
    # Pattern to match ConfigDict with extra='forbid' - handles multi-line format
    # Matches:
    #     model_config = ConfigDict(
    #         extra='forbid',
    #     )
    pattern = r'    model_config\s*=\s*ConfigDict\s*\(\s*\n\s+extra\s*=\s*[\'"]forbid[\'"]\s*,?\s*\n\s+\)\s*\n'
    
    content = re.sub(pattern, '', content, flags=re.MULTILINE)
    
    return content


def fix_rootmodel_to_union(content):
    """Replace RootModel classes with Union type aliases to avoid oneOf in JSON schema"""
    
    # Fix EventAction - replace RootModel with Union type alias
    eventaction_pattern = r'class EventAction\(\s*RootModel\[\s*Union\[\s*NavigateAction,\s*SetStateAction,\s*SubmitFormAction,\s*ValidateAction,\s*CustomAction,\s*\]\s*\]\s*\):\s*root: Union\[\s*NavigateAction, SetStateAction, SubmitFormAction, ValidateAction, CustomAction\s*\] = Field\(\.\.\., discriminator=\'type\'\)'
    
    eventaction_replacement = '''EventAction = Union[
    NavigateAction,
    SetStateAction,
    SubmitFormAction,
    ValidateAction,
    CustomAction,
]'''
    
    content = re.sub(eventaction_pattern, eventaction_replacement, content, flags=re.MULTILINE | re.DOTALL)
    
    # Fix Node - replace RootModel with Union type alias  
    node_pattern = r'class Node\(\s*RootModel\[\s*Union\[\s*ButtonNode,\s*InputNode,\s*TextareaNode,\s*TextNode,\s*CardNode,\s*AlertNode,\s*ContainerNode,\s*GridNode,\s*StackNode,\s*ChartNode,\s*\]\s*\]\s*\):\s*root: Union\[\s*ButtonNode,\s*InputNode,\s*TextareaNode,\s*TextNode,\s*CardNode,\s*AlertNode,\s*ContainerNode,\s*GridNode,\s*StackNode,\s*ChartNode,\s*\] = Field\(\s*\.\.\.,\s*description=\'A UI component node with unique ID, type, and props\',\s*discriminator=\'type\',\s*\)'
    
    node_replacement = '''Node = Union[
    ButtonNode,
    InputNode,
    TextareaNode,
    TextNode,
    CardNode,
    AlertNode,
    ContainerNode,
    GridNode,
    StackNode,
    ChartNode,
]'''
    
    content = re.sub(node_pattern, node_replacement, content, flags=re.MULTILINE | re.DOTALL)
    
    # Remove RootModel import if no longer needed
    if 'RootModel' not in content:
        content = re.sub(r'from pydantic import BaseModel, ConfigDict, Field, RootModel, conint, constr\n', 
                       'from pydantic import BaseModel, ConfigDict, Field, conint, constr\n', content)
    
    return content


def main():
    if len(sys.argv) != 3:
        print("Usage: python fix-python-oneof.py <input_file> <output_file>")
        sys.exit(1)
    
    input_file = Path(sys.argv[1])
    output_file = Path(sys.argv[2])
    
    # Read the generated file
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Apply fixes
    content = remove_extra_forbid_config(content)
    fixed_content = fix_rootmodel_to_union(content)
    
    # Write the fixed content
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print("✅ Post-processing completed!")


if __name__ == '__main__':
    main()
