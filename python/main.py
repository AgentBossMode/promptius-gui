"""
Robust Type-Safe UI Schema - No Dict/Any types
Every component has explicit, validated props
"""

from typing import List, Literal, Optional, Union
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

# ----------------------------------------------------------------------------
# EVENT BINDING - JSON-schema friendly representation for (event, action)
# ----------------------------------------------------------------------------
class EventBinding(BaseModel):
    """Binds a UI event to a specific action.

    Using a model avoids tuple schemas which some tools cannot represent
    as valid JSON Schema (missing items definition). This structure is
    also clearer and easier to extend in the future.
    """
    event: EventType
    action: EventAction

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
    events: Optional[List[EventBinding]] = None

class InputComponent(BaseModel):
    """Input component with type-safe props"""
    type: Literal["input"] = "input"
    id: str = Field(..., min_length=1)
    props: InputProps
    events: Optional[List[EventBinding]] = None

class TextareaComponent(BaseModel):
    """Textarea component with type-safe props"""
    type: Literal["textarea"] = "textarea"
    id: str = Field(..., min_length=1)
    props: TextareaProps
    events: Optional[List[EventBinding]] = None

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
# EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    # Example 1: Contact Form
    contact_form = UISchema(
        metadata=UIMetadata(
            title="Contact Form",
            description="Get in touch with us",
            framework="shadcn"
        ),
        root=CardComponent(
            id="contact-card",
            props=CardProps(
                title="Contact Us",
                description="Fill out the form below",
                elevation=2
            ),
            children=[
                StackComponent(
                    id="form-stack",
                    props=StackProps(
                        direction=FlexDirection.COLUMN,
                        gap=16
                    ),
                    children=[
                        InputComponent(
                            id="name-input",
                            props=InputProps(
                                label="Full Name",
                                placeholder="John Doe",
                                required=True,
                                type=InputType.TEXT
                            ),
                            events=[
                                EventBinding(
                                    event=EventType.CHANGE,
                                    action=SetStateAction(
                                        type="setState",
                                        key="name",
                                        value=""
                                    )
                                )
                            ]
                        ),
                        InputComponent(
                            id="email-input",
                            props=InputProps(
                                label="Email",
                                placeholder="john@example.com",
                                required=True,
                                type=InputType.EMAIL
                            )
                        ),
                        TextareaComponent(
                            id="message-textarea",
                            props=TextareaProps(
                                label="Message",
                                placeholder="Your message...",
                                rows=5,
                                required=True
                            )
                        ),
                        AlertComponent(
                            id="privacy-alert",
                            props=AlertProps(
                                message="Your information is secure and will not be shared.",
                                variant=AlertVariant.INFO
                            )
                        ),
                        GridComponent(
                            id="button-grid",
                            props=GridProps(
                                columns=2,
                                gap=12
                            ),
                            children=[
                                ButtonComponent(
                                    id="cancel-btn",
                                    props=ButtonProps(
                                        label="Cancel",
                                        variant=ButtonVariant.OUTLINE
                                    )
                                ),
                                ButtonComponent(
                                    id="submit-btn",
                                    props=ButtonProps(
                                        label="Submit",
                                        variant=ButtonVariant.PRIMARY
                                    ),
                                    events=[
                                        EventBinding(
                                            event=EventType.CLICK,
                                            action=SubmitFormAction(
                                                type="submitForm",
                                                endpoint="/api/contact",
                                                method="POST"
                                            )
                                        )
                                    ]
                                )
                            ]
                        )
                    ]
                )
            ]
        )
    )

    print("=== CONTACT FORM SCHEMA ===")
    print(contact_form.to_json())

    # Example 2: Dashboard
    dashboard = UISchema(
        metadata=UIMetadata(
            title="Analytics Dashboard",
            description="System metrics overview",
            framework="material-ui"
        ),
        root=ContainerComponent(
            id="dashboard-container",
            props=ContainerProps(
                maxWidth=1200,
                padding=24
            ),
            children=[
                TextComponent(
                    id="dashboard-title",
                    props=TextProps(
                        content="Analytics Dashboard",
                        tag=TextTag.H1,
                        bold=True
                    )
                ),
                GridComponent(
                    id="metrics-grid",
                    props=GridProps(
                        columns=3,
                        gap=16
                    ),
                    children=[
                        CardComponent(
                            id="users-card",
                            props=CardProps(
                                title="Total Users",
                                elevation=2
                            ),
                            children=[
                                TextComponent(
                                    id="users-count",
                                    props=TextProps(
                                        content="12,345",
                                        tag=TextTag.H2,
                                        bold=True
                                    )
                                ),
                                TextComponent(
                                    id="users-change",
                                    props=TextProps(
                                        content="+12.5% from last month",
                                        tag=TextTag.SPAN,
                                        color="green"
                                    )
                                )
                            ]
                        ),
                        CardComponent(
                            id="revenue-card",
                            props=CardProps(
                                title="Revenue",
                                elevation=2
                            ),
                            children=[
                                TextComponent(
                                    id="revenue-amount",
                                    props=TextProps(
                                        content="$98,765",
                                        tag=TextTag.H2,
                                        bold=True
                                    )
                                )
                            ]
                        ),
                        CardComponent(
                            id="sessions-card",
                            props=CardProps(
                                title="Active Sessions",
                                elevation=2
                            ),
                            children=[
                                TextComponent(
                                    id="sessions-count",
                                    props=TextProps(
                                        content="432",
                                        tag=TextTag.H2,
                                        bold=True
                                    )
                                )
                            ]
                        )
                    ]
                ),
                AlertComponent(
                    id="status-alert",
                    props=AlertProps(
                        message="All systems operational",
                        variant=AlertVariant.SUCCESS,
                        title="System Status"
                    )
                )
            ]
        )
    )

    print("\n=== DASHBOARD SCHEMA ===")
    print(dashboard.to_json())

    # Validate that invalid schemas are rejected
    try:
        invalid = UISchema(
            metadata=UIMetadata(title="Test"),
            root=ButtonComponent(
                id="btn",
                props=ButtonProps(
                    label="",  # Empty label should fail
                    variant=ButtonVariant.PRIMARY
                )
            )
        )
    except Exception as e:
        print(f"\n✅ Validation working: {e}")