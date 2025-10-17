from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field, field_validator
from enum import Enum

class ComponentType(str, Enum):
    """Enumeration of supported component types"""
    BUTTON = "button"
    INPUT = "input"
    TEXT = "text"
    CONTAINER = "container"
    CARD = "card"
    ALERT = "alert"
    FORM_CONTAINER = "formContainer"
    GRID = "grid"
    STACK = "stack"

class EventType(str, Enum):
    """Enumeration of supported event types"""
    SUBMIT = "submit"
    NAVIGATE = "navigate"
    SET_STATE = "setState"
    VALIDATE = "validate"
    CUSTOM = "custom"

class EventHandler(BaseModel):
    """Defines an event handler with type and optional parameters"""
    type: EventType
    action: Optional[str] = None
    params: Optional[Dict[str, Any]] = None

    class Config:
        use_enum_values = True

class Layout(BaseModel):
    """Layout configuration for grid and stack components"""
    columns: Optional[int] = Field(None, ge=1, le=12)
    gap: Optional[int] = Field(None, ge=0)
    direction: Optional[Literal["row", "column"]] = "column"

class UIComponent(BaseModel):
    """
    Core component definition - recursive structure for UI tree
    This is the fundamental building block of the UI schema
    """
    id: str = Field(..., description="Unique identifier for the component")
    type: ComponentType = Field(..., description="Type of component to render")
    props: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Component-specific properties (e.g., label, placeholder)"
    )
    events: Optional[Dict[str, EventHandler]] = Field(
        default_factory=dict,
        description="Event handlers mapped to event names (e.g., onClick, onChange)"
    )
    children: Optional[List['UIComponent']] = Field(
        default_factory=list,
        description="Child components for containers and layouts"
    )
    layout: Optional[Layout] = Field(
        None,
        description="Layout configuration for grid/stack components"
    )

    @field_validator('id')
    @classmethod
    def validate_id(cls, v: str) -> str:
        """Ensure ID is non-empty and follows naming conventions"""
        if not v or not v.strip():
            raise ValueError("Component ID cannot be empty")
        return v.strip()

    @field_validator('children')
    @classmethod
    def validate_children_for_type(cls, v: Optional[List['UIComponent']], info) -> Optional[List['UIComponent']]:
        """Validate that only container-type components have children"""
        component_type = info.data.get('type')
        container_types = {
            ComponentType.CONTAINER,
            ComponentType.CARD,
            ComponentType.FORM_CONTAINER,
            ComponentType.GRID,
            ComponentType.STACK
        }
        
        if v and component_type not in container_types:
            raise ValueError(f"Component type '{component_type}' cannot have children")
        
        return v

    class Config:
        use_enum_values = True
        json_schema_extra = {
            "examples": [
                {
                    "id": "submit-btn",
                    "type": "button",
                    "props": {"label": "Submit", "variant": "default"},
                    "events": {
                        "onClick": {"type": "submit"}
                    }
                }
            ]
        }

class UIMetadata(BaseModel):
    """Metadata about the UI schema"""
    title: Optional[str] = None
    description: Optional[str] = None
    framework: Literal["shadcn", "material-ui", "chakra-ui", "ant-design"] = "shadcn"
    version: Optional[str] = "1.0.0"
    author: Optional[str] = None
    created_at: Optional[str] = None

class UISchema(BaseModel):
    """
    Top-level UI schema definition
    This is the main contract between backend/AI and frontend
    """
    version: str = Field(default="1.0.0", description="Schema version")
    root: UIComponent = Field(..., description="Root component of the UI tree")
    metadata: Optional[UIMetadata] = Field(
        default_factory=UIMetadata,
        description="Additional metadata about the UI"
    )

    @field_validator('version')
    @classmethod
    def validate_version(cls, v: str) -> str:
        """Validate semantic versioning format"""
        parts = v.split('.')
        if len(parts) != 3 or not all(p.isdigit() for p in parts):
            raise ValueError("Version must follow semantic versioning (e.g., 1.0.0)")
        return v

    def to_json(self) -> str:
        """Export schema as JSON string for frontend consumption"""
        return self.model_dump_json(indent=2, exclude_none=True)

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "version": "1.0.0",
                    "metadata": {
                        "title": "Contact Form",
                        "framework": "shadcn"
                    },
                    "root": {
                        "id": "root",
                        "type": "container",
                        "children": [
                            {
                                "id": "name-input",
                                "type": "input",
                                "props": {"placeholder": "Enter your name"}
                            }
                        ]
                    }
                }
            ]
        }

# Enable forward references for recursive model
UIComponent.model_rebuild()


# ============================================================================
# UTILITY FUNCTIONS FOR AI/BACKEND USAGE
# ============================================================================

class UISchemaBuilder:
    """Helper class for programmatically building UI schemas"""
    
    @staticmethod
    def create_form(
        title: str,
        fields: List[Dict[str, Any]],
        submit_label: str = "Submit"
    ) -> UISchema:
        """
        Create a standard form schema
        
        Args:
            title: Form title
            fields: List of field definitions
            submit_label: Label for submit button
        
        Returns:
            Complete UISchema for a form
        """
        children = []
        
        for field in fields:
            field_stack = UIComponent(
                id=f"{field['name']}-stack",
                type=ComponentType.STACK,
                layout=Layout(gap=8),
                children=[
                    UIComponent(
                        id=f"{field['name']}-label",
                        type=ComponentType.TEXT,
                        props={
                            "tag": "label",
                            "content": field.get("label", field["name"].title()),
                            "className": "text-sm font-medium"
                        }
                    ),
                    UIComponent(
                        id=f"{field['name']}-input",
                        type=ComponentType.INPUT,
                        props={
                            "type": field.get("type", "text"),
                            "placeholder": field.get("placeholder", ""),
                            "required": field.get("required", False)
                        }
                    )
                ]
            )
            children.append(field_stack)
        
        # Add submit button
        children.append(
            UIComponent(
                id="submit-btn",
                type=ComponentType.BUTTON,
                props={"label": submit_label, "variant": "default"},
                events={"onClick": EventHandler(type=EventType.SUBMIT)}
            )
        )
        
        return UISchema(
            version="1.0.0",
            metadata=UIMetadata(title=title),
            root=UIComponent(
                id="root",
                type=ComponentType.CARD,
                props={"title": title},
                children=children
            )
        )
    
    @staticmethod
    def create_dashboard(
        title: str,
        metrics: List[Dict[str, Any]]
    ) -> UISchema:
        """
        Create a dashboard with metric cards
        
        Args:
            title: Dashboard title
            metrics: List of metric definitions with name and value
        
        Returns:
            Complete UISchema for a dashboard
        """
        metric_cards = [
            UIComponent(
                id=f"metric-{i}",
                type=ComponentType.CARD,
                props={"title": metric["name"]},
                children=[
                    UIComponent(
                        id=f"metric-{i}-value",
                        type=ComponentType.TEXT,
                        props={
                            "tag": "p",
                            "content": str(metric["value"]),
                            "className": "text-3xl font-bold"
                        }
                    )
                ]
            )
            for i, metric in enumerate(metrics)
        ]
        
        return UISchema(
            version="1.0.0",
            metadata=UIMetadata(title=title),
            root=UIComponent(
                id="root",
                type=ComponentType.CONTAINER,
                children=[
                    UIComponent(
                        id="metrics-grid",
                        type=ComponentType.GRID,
                        layout=Layout(columns=3, gap=16),
                        children=metric_cards
                    )
                ]
            )
        )


# Example usage
if __name__ == "__main__":
    # Example 1: Create a contact form
    contact_form = UISchemaBuilder.create_form(
        title="Contact Us",
        fields=[
            {"name": "name", "label": "Full Name", "placeholder": "John Doe"},
            {"name": "email", "label": "Email", "type": "email", "placeholder": "john@example.com"},
            {"name": "message", "label": "Message", "placeholder": "Your message..."}
        ]
    )
    
    print("=== Contact Form Schema ===")
    print(contact_form.to_json())
    
    # Example 2: Create a dashboard
    dashboard = UISchemaBuilder.create_dashboard(
        title="System Metrics",
        metrics=[
            {"name": "Active Users", "value": "1,234"},
            {"name": "Response Time", "value": "45ms"},
            {"name": "Uptime", "value": "99.9%"}
        ]
    )
    
    print("\n=== Dashboard Schema ===")
    print(dashboard.to_json())