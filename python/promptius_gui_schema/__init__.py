"""
Promptius GUI Schema - Type-safe UI schema definitions for cross-platform UI generation.

This package provides robust, type-safe UI schema definitions that can be used
to generate UI components across different frameworks (React, Vue, Angular, etc.)
with full TypeScript compatibility.

This file is auto-generated from schema/promptius-gui-schema.json
DO NOT EDIT MANUALLY - Use scripts/generate-python-ast.py to regenerate
"""

__version__ = "0.1.0"

from typing import List, Literal, Optional, Union, Tuple, Dict, Any, Annotated
from pydantic import BaseModel, Field
from enum import Enum

class ButtonVariant(Enum):
    """Button visual variant"""
    PRIMARY = "primary"
    SECONDARY = "secondary"
    OUTLINE = "outline"
    GHOST = "ghost"
    DESTRUCTIVE = "destructive"

class ButtonSize(Enum):
    """Button size variant"""
    SM = "sm"
    MD = "md"
    LG = "lg"

class InputType(Enum):
    """HTML input type"""
    TEXT = "text"
    EMAIL = "email"
    PASSWORD = "password"
    NUMBER = "number"
    TEL = "tel"
    URL = "url"
    SEARCH = "search"
    DATE = "date"

class InputSize(Enum):
    """Input size variant"""
    SM = "sm"
    MD = "md"
    LG = "lg"

class AlertVariant(Enum):
    """Alert visual variant"""
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"

class TextTag(Enum):
    """HTML tag for text component"""
    H1 = "h1"
    H2 = "h2"
    H3 = "h3"
    H4 = "h4"
    H5 = "h5"
    H6 = "h6"
    P = "p"
    SPAN = "span"
    LABEL = "label"

class AlignText(Enum):
    """Text alignment"""
    LEFT = "left"
    CENTER = "center"
    RIGHT = "right"
    JUSTIFY = "justify"

class FlexDirection(Enum):
    """Flexbox direction"""
    ROW = "row"
    COLUMN = "column"

class ChartType(Enum):
    """Chart visualization type"""
    BAR = "bar"
    LINE = "line"
    PIE = "pie"

class EventType(Enum):
    """Event handler type"""
    ONCLICK = "onClick"
    ONSUBMIT = "onSubmit"
    ONCHANGE = "onChange"
    ONFOCUS = "onFocus"
    ONBLUR = "onBlur"

class NavigateAction(BaseModel):
    """Navigate to a URL or route"""

    type: Literal['navigate']
    url: Annotated[str, Field(min_length=1)]
    target: Literal['_self', '_blank'] = "_self"

class SetStateAction(BaseModel):
    """Update component state"""

    type: Literal['setState']
    key: Annotated[str, Field(min_length=1)]
    value: Union[str, float, bool]

class SubmitFormAction(BaseModel):
    """Submit form data"""

    type: Literal['submitForm']
    endpoint: Optional[str] = None
    method: Literal['POST', 'PUT', 'PATCH'] = "POST"

class ValidateAction(BaseModel):
    """Validate form or input"""

    type: Literal['validate']
    rules: Optional[List[str]] = None

class CustomAction(BaseModel):
    """Custom handler reference"""

    type: Literal['custom']
    handler: Annotated[str, Field(min_length=1)]

class ButtonProps(BaseModel):
    """Type-safe props for Button component"""

    label: Annotated[str, Field(min_length=1)]
    variant: ButtonVariant = "primary"
    size: ButtonSize = "md"
    disabled: bool = False
    fullWidth: bool = False
    loading: bool = False

class InputProps(BaseModel):
    """Type-safe props for Input component"""

    placeholder: str = ""
    type: InputType = "text"
    size: InputSize = "md"
    disabled: bool = False
    required: bool = False
    label: Optional[str] = None
    helperText: Optional[str] = None
    defaultValue: Optional[str] = None
    maxLength: Annotated[int, Field(ge=1, default=None)]
    minLength: Annotated[int, Field(ge=0, default=None)]

class TextareaProps(BaseModel):
    """Type-safe props for Textarea component"""

    placeholder: str = ""
    rows: Annotated[int, Field(ge=1, le=20, default=4)]
    disabled: bool = False
    required: bool = False
    label: Optional[str] = None
    helperText: Optional[str] = None
    maxLength: Annotated[int, Field(ge=1, default=None)]

class TextProps(BaseModel):
    """Type-safe props for Text component"""

    content: str
    tag: TextTag = "p"
    align: AlignText = "left"
    bold: bool = False
    italic: bool = False
    color: Annotated[str, Field(pattern=r"^(#[0-9A-Fa-f]{6}|[a-z\-]+)$", default=None)]

class CardProps(BaseModel):
    """Type-safe props for Card component"""

    title: Optional[str] = None
    description: Optional[str] = None
    elevation: Annotated[int, Field(ge=0, le=5, default=1)]
    padding: Annotated[int, Field(ge=0, le=64, default=16)]

class AlertProps(BaseModel):
    """Type-safe props for Alert component"""

    message: Annotated[str, Field(min_length=1)]
    title: Optional[str] = None
    variant: AlertVariant = "info"
    dismissible: bool = False

class ContainerProps(BaseModel):
    """Type-safe props for Container component"""

    maxWidth: Annotated[int, Field(ge=320, le=1920, default=None)]
    padding: Annotated[int, Field(ge=0, le=64, default=16)]
    centered: bool = False

class GridProps(BaseModel):
    """Type-safe props for Grid layout"""

    columns: Annotated[int, Field(ge=1, le=12, default=1)]
    gap: Annotated[int, Field(ge=0, le=64, default=16)]
    responsive: bool = True

class StackProps(BaseModel):
    """Type-safe props for Stack layout"""

    direction: FlexDirection = "column"
    gap: Annotated[int, Field(ge=0, le=64, default=8)]
    align: Literal['start', 'center', 'end', 'stretch'] = "stretch"

class ChartSeries(BaseModel):
    """Chart data series"""

    name: Optional[str] = None
    data: Annotated[List[float], Field(min_length=1)]

class AxisXProps(BaseModel):
    """X-axis configuration"""

    label: Optional[str] = None
    ticks: Optional[List[str]] = None
    showGrid: bool = False

class AxisYProps(BaseModel):
    """Y-axis configuration"""

    label: Optional[str] = None
    min: Optional[float] = None
    max: Optional[float] = None
    showGrid: bool = False

class ChartAnnotation(BaseModel):
    """Chart annotation"""

    x: Optional[float] = None
    y: Optional[float] = None
    label: str

class ChartProps(BaseModel):
    """Type-safe props for Chart component"""

    chartType: ChartType
    width: Annotated[int, Field(ge=100, le=4000, default=None)]
    height: Annotated[int, Field(ge=100, le=4000, default=None)]
    labels: Optional[List[str]] = None
    series: Annotated[List[ChartSeries], Field(min_length=1)]
    colors: Optional[List[str]] = None
    title: Optional[str] = None
    showLegend: bool = True
    legendPosition: Literal['top', 'right', 'bottom', 'left'] = "top"
    xAxis: Optional[AxisXProps] = None
    yAxis: Optional[AxisYProps] = None
    annotations: Optional[List[ChartAnnotation]] = None

EventAction = Union[
    NavigateAction,
    SetStateAction,
    SubmitFormAction,
    ValidateAction,
    CustomAction,
]

class EventBinding(BaseModel):
    """Binds a UI event to a specific action"""

    event: EventType
    action: EventAction

class ButtonComponent(BaseModel):
    """Button component with type-safe props"""

    type: Literal['button']
    id: Annotated[str, Field(min_length=1)]
    props: ButtonProps
    events: Optional[List[EventBinding]] = None

class InputComponent(BaseModel):
    """Input component with type-safe props"""

    type: Literal['input']
    id: Annotated[str, Field(min_length=1)]
    props: InputProps
    events: Optional[List[EventBinding]] = None

class TextareaComponent(BaseModel):
    """Textarea component with type-safe props"""

    type: Literal['textarea']
    id: Annotated[str, Field(min_length=1)]
    props: TextareaProps
    events: Optional[List[EventBinding]] = None

class TextComponent(BaseModel):
    """Text component with type-safe props"""

    type: Literal['text']
    id: Annotated[str, Field(min_length=1)]
    props: TextProps

class AlertComponent(BaseModel):
    """Alert component with type-safe props"""

    type: Literal['alert']
    id: Annotated[str, Field(min_length=1)]
    props: AlertProps

class CardComponent(BaseModel):
    """Card component with type-safe props"""

    type: Literal['card']
    id: Annotated[str, Field(min_length=1)]
    props: CardProps
    children: Optional[List['UIComponent']] = None

class ContainerComponent(BaseModel):
    """Container component with type-safe props"""

    type: Literal['container']
    id: Annotated[str, Field(min_length=1)]
    props: ContainerProps
    children: Optional[List['UIComponent']] = None

class GridComponent(BaseModel):
    """Grid layout with type-safe props"""

    type: Literal['grid']
    id: Annotated[str, Field(min_length=1)]
    props: GridProps
    children: Optional[List['UIComponent']] = None

class StackComponent(BaseModel):
    """Stack layout with type-safe props"""

    type: Literal['stack']
    id: Annotated[str, Field(min_length=1)]
    props: StackProps
    children: Optional[List['UIComponent']] = None

class ChartComponent(BaseModel):
    """Chart component with type-safe props"""

    type: Literal['chart']
    id: Annotated[str, Field(min_length=1)]
    props: ChartProps

UIComponent = Union[
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    TextComponent,
    CardComponent,
    AlertComponent,
    ContainerComponent,
    GridComponent,
    StackComponent,
    ChartComponent,
]

class UIMetadata(BaseModel):
    """Metadata for the UI schema"""

    title: Annotated[str, Field(min_length=1)]
    description: Optional[str] = None
    version: Annotated[str, Field(pattern=r"^\d+\.\d+\.\d+$", default="1.0.0")]
    framework: Literal['shadcn', 'material-ui', 'chakra-ui', 'ant-design'] = "shadcn"

class UISchema(BaseModel):
    """Complete UI schema definition"""
    metadata: UIMetadata
    root: UIComponent

    def to_json(self) -> str:
        """Export as JSON for frontend"""
        return self.model_dump_json(indent=2, exclude_none=True)

# ============================================================================
# PUBLIC API EXPORTS
# ============================================================================

__all__ = [
    # Enums
    "ButtonVariant", "ButtonSize", "InputType", "InputSize", "AlertVariant",
    "TextTag", "AlignText", "FlexDirection", "ChartType", "EventType",
    
    # Event Actions
    "NavigateAction", "SetStateAction", "SubmitFormAction", "ValidateAction",
    "CustomAction", "EventAction", "EventBinding",
    
    # Component Props
    "ButtonProps", "InputProps", "TextareaProps", "TextProps", "CardProps",
    "AlertProps", "ContainerProps", "GridProps", "StackProps", "ChartSeries",
    "AxisXProps", "AxisYProps", "ChartAnnotation", "ChartProps",
    
    # Components
    "ButtonComponent", "InputComponent", "TextareaComponent", "TextComponent",
    "CardComponent", "AlertComponent", "ContainerComponent", "GridComponent",
    "StackComponent", "ChartComponent", "UIComponent",
    
    # Schema
    "UIMetadata", "UISchema",
]