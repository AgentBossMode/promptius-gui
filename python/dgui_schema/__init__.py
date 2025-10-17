"""
DGUI Schema - Type-safe UI schema definitions for cross-platform UI generation.

This package provides robust, type-safe UI schema definitions that can be used
to generate UI components across different frameworks (React, Vue, Angular, etc.)
with full TypeScript compatibility.
"""

__version__ = "0.1.0"

from typing import List, Literal, Optional, Union, Tuple
from pydantic import BaseModel, Field
from enum import Enum

# ============================================================================
# ENUMS - Explicit valid values
# ============================================================================

class ButtonVariant(str, Enum):
    PRIMARY = "primary"
    SECONDARY = "secondary"
    OUTLINE = "outline"
    GHOST = "ghost"
    DESTRUCTIVE = "destructive"

class ButtonSize(str, Enum):
    SMALL = "sm"
    MEDIUM = "md"
    LARGE = "lg"

class InputType(str, Enum):
    TEXT = "text"
    EMAIL = "email"
    PASSWORD = "password"
    NUMBER = "number"
    TEL = "tel"
    URL = "url"
    SEARCH = "search"
    DATE = "date"

class InputSize(str, Enum):
    SMALL = "sm"
    MEDIUM = "md"
    LARGE = "lg"

class AlertVariant(str, Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"

class TextTag(str, Enum):
    H1 = "h1"
    H2 = "h2"
    H3 = "h3"
    H4 = "h4"
    H5 = "h5"
    H6 = "h6"
    P = "p"
    SPAN = "span"
    LABEL = "label"

class AlignText(str, Enum):
    LEFT = "left"
    CENTER = "center"
    RIGHT = "right"
    JUSTIFY = "justify"

class FlexDirection(str, Enum):
    ROW = "row"
    COLUMN = "column"

class ChartType(str, Enum):
    BAR = "bar"
    LINE = "line"
    PIE = "pie"

class EventType(str, Enum):
    CLICK = "onClick"
    SUBMIT = "onSubmit"
    CHANGE = "onChange"
    FOCUS = "onFocus"
    BLUR = "onBlur"

# ============================================================================
# EVENT HANDLERS - Explicit actions
# ============================================================================

class NavigateAction(BaseModel):
    """Navigate to a URL or route"""
    type: Literal["navigate"] = "navigate"
    url: str = Field(..., description="URL or route to navigate to")
    target: Optional[Literal["_self", "_blank"]] = "_self"

class SetStateAction(BaseModel):
    """Update component state"""
    type: Literal["setState"] = "setState"
    key: str = Field(..., description="State key to update")
    value: Union[str, int, bool, float] = Field(..., description="Value to set")

class SubmitFormAction(BaseModel):
    """Submit form data"""
    type: Literal["submitForm"] = "submitForm"
    endpoint: Optional[str] = Field(None, description="API endpoint to submit to")
    method: Literal["POST", "PUT", "PATCH"] = "POST"

class ValidateAction(BaseModel):
    """Validate form or input"""
    type: Literal["validate"] = "validate"
    rules: List[str] = Field(default_factory=list, description="Validation rules")

class CustomAction(BaseModel):
    """Custom handler reference"""
    type: Literal["custom"] = "custom"
    handler: str = Field(..., description="Name of custom handler function")

EventAction = Union[NavigateAction, SetStateAction, SubmitFormAction, ValidateAction, CustomAction]

# ============================================================================
# COMPONENT-SPECIFIC PROPS - No generic dicts!
# ============================================================================

class ButtonProps(BaseModel):
    """Type-safe props for Button component"""
    label: str = Field(..., min_length=1, description="Button text")
    variant: ButtonVariant = ButtonVariant.PRIMARY
    size: ButtonSize = ButtonSize.MEDIUM
    disabled: bool = False
    fullWidth: bool = False
    loading: bool = False

class InputProps(BaseModel):
    """Type-safe props for Input component"""
    placeholder: str = Field("", description="Placeholder text")
    type: InputType = InputType.TEXT
    size: InputSize = InputSize.MEDIUM
    disabled: bool = False
    required: bool = False
    label: Optional[str] = None
    helperText: Optional[str] = None
    defaultValue: Optional[str] = None
    maxLength: Optional[int] = Field(None, ge=1)
    minLength: Optional[int] = Field(None, ge=0)

class TextareaProps(BaseModel):
    """Type-safe props for Textarea component"""
    placeholder: str = ""
    rows: int = Field(4, ge=1, le=20)
    disabled: bool = False
    required: bool = False
    label: Optional[str] = None
    helperText: Optional[str] = None
    maxLength: Optional[int] = Field(None, ge=1)

class TextProps(BaseModel):
    """Type-safe props for Text component"""
    content: str = Field(..., description="Text content")
    tag: TextTag = TextTag.P
    align: AlignText = AlignText.LEFT
    bold: bool = False
    italic: bool = False
    color: Optional[str] = Field(None, pattern=r"^(#[0-9A-Fa-f]{6}|[a-z\-]+)$")

class CardProps(BaseModel):
    """Type-safe props for Card component"""
    title: Optional[str] = None
    description: Optional[str] = None
    elevation: int = Field(1, ge=0, le=5)
    padding: int = Field(16, ge=0, le=64)

class AlertProps(BaseModel):
    """Type-safe props for Alert component"""
    message: str = Field(..., min_length=1, description="Alert message")
    title: Optional[str] = None
    variant: AlertVariant = AlertVariant.INFO
    dismissible: bool = False

class ContainerProps(BaseModel):
    """Type-safe props for Container component"""
    maxWidth: Optional[int] = Field(None, ge=320, le=1920)
    padding: int = Field(16, ge=0, le=64)
    centered: bool = False

class GridProps(BaseModel):
    """Type-safe props for Grid layout"""
    columns: int = Field(1, ge=1, le=12, description="Number of columns")
    gap: int = Field(16, ge=0, le=64, description="Gap between items in pixels")
    responsive: bool = Field(True, description="Enable responsive behavior")

class StackProps(BaseModel):
    """Type-safe props for Stack layout"""
    direction: FlexDirection = FlexDirection.COLUMN
    gap: int = Field(8, ge=0, le=64)
    align: Literal["start", "center", "end", "stretch"] = "stretch"

class ChartSeries(BaseModel):
    name: Optional[str] = None
    data: List[float] = Field(..., min_length=1)

class AxisXProps(BaseModel):
    label: Optional[str] = None
    ticks: Optional[List[str]] = None
    showGrid: bool = False

class AxisYProps(BaseModel):
    label: Optional[str] = None
    min: Optional[float] = None
    max: Optional[float] = None
    showGrid: bool = False

class ChartAnnotation(BaseModel):
    x: Optional[float] = None
    y: Optional[float] = None
    label: str

class ChartProps(BaseModel):
    """Type-safe props for Chart component"""
    chartType: ChartType
    width: Optional[int] = Field(None, ge=100, le=4000)
    height: Optional[int] = Field(None, ge=100, le=4000)
    labels: Optional[List[str]] = None
    series: List[ChartSeries] = Field(..., min_length=1)
    colors: Optional[List[str]] = None
    title: Optional[str] = None
    showLegend: bool = True
    legendPosition: Optional[Literal['top', 'right', 'bottom', 'left']] = 'top'
    xAxis: Optional[AxisXProps] = None
    yAxis: Optional[AxisYProps] = None
    annotations: Optional[List[ChartAnnotation]] = None

# ============================================================================
# TYPED COMPONENTS - Discriminated Union
# ============================================================================

class ButtonComponent(BaseModel):
    """Button component with type-safe props"""
    type: Literal["button"] = "button"
    id: str = Field(..., min_length=1)
    props: ButtonProps
    events: Optional[List[Tuple[EventType, EventAction]]] = None

class InputComponent(BaseModel):
    """Input component with type-safe props"""
    type: Literal["input"] = "input"
    id: str = Field(..., min_length=1)
    props: InputProps
    events: Optional[List[Tuple[EventType, EventAction]]] = None

class TextareaComponent(BaseModel):
    """Textarea component with type-safe props"""
    type: Literal["textarea"] = "textarea"
    id: str = Field(..., min_length=1)
    props: TextareaProps
    events: Optional[List[Tuple[EventType, EventAction]]] = None

class TextComponent(BaseModel):
    """Text component with type-safe props"""
    type: Literal["text"] = "text"
    id: str = Field(..., min_length=1)
    props: TextProps

class CardComponent(BaseModel):
    """Card component with type-safe props"""
    type: Literal["card"] = "card"
    id: str = Field(..., min_length=1)
    props: CardProps
    children: List['UIComponent'] = Field(default_factory=list)

class AlertComponent(BaseModel):
    """Alert component with type-safe props"""
    type: Literal["alert"] = "alert"
    id: str = Field(..., min_length=1)
    props: AlertProps

class ContainerComponent(BaseModel):
    """Container component with type-safe props"""
    type: Literal["container"] = "container"
    id: str = Field(..., min_length=1)
    props: ContainerProps
    children: List['UIComponent'] = Field(default_factory=list)

class GridComponent(BaseModel):
    """Grid layout with type-safe props"""
    type: Literal["grid"] = "grid"
    id: str = Field(..., min_length=1)
    props: GridProps
    children: List['UIComponent'] = Field(default_factory=list)

class StackComponent(BaseModel):
    """Stack layout with type-safe props"""
    type: Literal["stack"] = "stack"
    id: str = Field(..., min_length=1)
    props: StackProps
    children: List['UIComponent'] = Field(default_factory=list)

class ChartComponent(BaseModel):
    """Chart component with type-safe props"""
    type: Literal["chart"] = "chart"
    id: str = Field(..., min_length=1)
    props: ChartProps

# ============================================================================
# DISCRIMINATED UNION - Type-safe component tree
# ============================================================================

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

# Forward reference resolution
CardComponent.model_rebuild()
ContainerComponent.model_rebuild()
GridComponent.model_rebuild()
StackComponent.model_rebuild()
ChartComponent.model_rebuild()

# ============================================================================
# TOP-LEVEL SCHEMA
# ============================================================================

class UIMetadata(BaseModel):
    """Metadata for the UI schema"""
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    version: str = Field(default="1.0.0", pattern=r"^\d+\.\d+\.\d+$")
    framework: Literal["shadcn", "material-ui", "chakra-ui", "ant-design"] = "shadcn"

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
    "CustomAction", "EventAction",
    
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
