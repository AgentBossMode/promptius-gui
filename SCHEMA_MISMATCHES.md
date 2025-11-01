# Pydantic-Zod Schema Mismatches Analysis

## Problem Overview

When Pydantic models call `model_dump()` (without `exclude_none=True`), optional fields with `None` values are serialized as `null` in JSON. However, Zod's `.optional()` only allows keys to be **absent** or **undefined**, NOT `null`. This causes validation failures on the frontend.

**Critical Issue**: In `python/server.py:43`, `model_dump()` is called WITHOUT `exclude_none=True`, meaning all Optional fields with `None` values will serialize as `null`.

## Mismatches Found

### 1. ChartProps - Object Fields (CRITICAL)

#### ChartProps.xAxis
- **JSON Schema** (line 626-628): Optional (not in required array)
- **Pydantic** (line 286): `Optional[AxisXProps] = None`
- **Zod** (line 244-248): `.strict().optional()` ❌
- **Issue**: When `xAxis` is `None`, Pydantic serializes as `{"xAxis": null}`, but Zod's `.optional()` rejects `null`
- **Fix**: Change to `.strict().nullish()` or `.strict().nullable().optional()`

#### ChartProps.yAxis
- **JSON Schema** (line 629-631): Optional (not in required array)
- **Pydantic** (line 287): `Optional[AxisYProps] = None`
- **Zod** (line 249-254): `.strict().optional()` ❌
- **Issue**: Same as xAxis - `null` values are rejected
- **Fix**: Change to `.strict().nullish()` or `.strict().nullable().optional()`

#### ChartProps.annotations
- **JSON Schema** (line 632-638): Optional (not in required array)
- **Pydantic** (line 288-290): `Optional[List[ChartAnnotation]] = Field(None, ...)`
- **Zod** (line 255-259): `.optional()` ❌
- **Issue**: When `annotations` is `None`, serializes as `{"annotations": null}`, but Zod rejects `null`
- **Fix**: Change to `.nullish()` or `.nullable().optional()`

### 2. ChartProps - Array Fields (MODERATE)

#### ChartProps.labels
- **JSON Schema** (line 591-597): Optional (not in required array)
- **Pydantic** (line 278): `Optional[List[str]] = Field(None, ...)`
- **Zod** (line 235): `.optional()` ⚠️
- **Issue**: Could serialize as `{"labels": null}` if None
- **Fix**: Consider `.nullish()` if null values are expected

#### ChartProps.colors
- **JSON Schema** (line 606-612): Optional (not in required array)
- **Pydantic** (line 282): `Optional[List[str]] = Field(None, ...)`
- **Zod** (line 240): `.optional()` ⚠️
- **Issue**: Could serialize as `{"colors": null}` if None
- **Fix**: Consider `.nullish()` if null values are expected

### 3. AxisXProps - Array Field (MODERATE)

#### AxisXProps.ticks
- **JSON Schema** (line 514-520): Optional (not in required array)
- **Pydantic** (line 246): `Optional[List[str]] = Field(None, ...)`
- **Zod** (line 246): `.optional()` ⚠️
- **Issue**: Could serialize as `{"ticks": null}` if None
- **Fix**: Consider `.nullish()` if null values are expected

### 4. GridProps.columns - Required vs Optional Mismatch (MODERATE)

#### GridProps.columns
- **JSON Schema** (line 459): `"required": ["columns"]` (REQUIRED)
- **Pydantic** (line 217): `Field(...)` (REQUIRED)
- **Zod** (line 98): `.default(1)` (makes it OPTIONAL)
- **Issue**: Field is required in JSON Schema and Pydantic, but Zod makes it optional due to default value
- **Analysis**: JSON Schema allows fields with defaults to still be in `required` array. Pydantic correctly requires it. Zod's `.default()` makes it optional, which is technically correct for input validation (if missing, use default), but creates a semantic mismatch.
- **Status**: This might be intentional - the field must exist in the schema, but Zod allows it to be omitted in input (with default applied). However, this could cause issues if the frontend expects it to always be present.

### 5. Primitive Optional Fields (LOW PRIORITY)

The following fields are `Optional[str] = Field(None, ...)` in Pydantic but `.optional()` in Zod. These CAN serialize as `null`, but are less likely to cause issues if the frontend handles them gracefully:

- `InputProps.label` (line 156 / Zod line 39)
- `InputProps.helperText` (line 157 / Zod line 40)
- `InputProps.defaultValue` (line 158 / Zod line 41)
- `TextareaProps.label` (line 170 / Zod line 53)
- `TextareaProps.helperText` (line 171 / Zod line 54)
- `CardProps.title` (line 189 / Zod line 72)
- `CardProps.description` (line 190 / Zod line 73)
- `AlertProps.title` (line 201 / Zod line 82)
- `ContainerProps.maxWidth` (line 207 / Zod line 90)
- `TextProps.color` (line 183 / Zod line 66)
- `ChartSeries.name` (line 240 / Zod line 237)
- `AxisXProps.label` (line 245 / Zod line 245)
- `AxisYProps.label` (line 251 / Zod line 250)
- `AxisYProps.min` (line 252 / Zod line 251)
- `AxisYProps.max` (line 253 / Zod line 252)
- `ChartAnnotation.x` (line 258 / Zod line 256)
- `ChartAnnotation.y` (line 259 / Zod line 257)
- `ChartProps.title` (line 283 / Zod line 241)
- `ChartProps.width` (line 272 / Zod line 233)
- `ChartProps.height` (line 275 / Zod line 234)
- `SubmitFormAction.endpoint` (line 114 / Zod line 162)
- `UIMetadata.description` (line 450 / Zod line 14)

**Note**: If `exclude_none=True` is used in `model_dump()`, these primitives won't serialize as `null` (they'll be omitted), so they might not cause issues. However, since the server doesn't use `exclude_none=True`, these could all potentially cause validation failures.

## Recommended Fixes

### Option 1: Fix Zod Schema Generator (RECOMMENDED)
Modify `scripts/custom-zod-generator.mjs` to use `.nullish()` instead of `.optional()` for:
- All Optional object fields (`Optional[ObjectType]`)
- All Optional array fields (`Optional[List[Type]]`)
- Optionally: All Optional primitive fields if null handling is needed

### Option 2: Fix Pydantic Serialization
Change `python/server.py:43` from:
```python
return answer.model_dump()
```
to:
```python
return answer.model_dump(exclude_none=True)
```

This prevents `null` values from being serialized, but makes the schema less flexible (can't distinguish between "not set" and "explicitly set to None").

### Option 3: Hybrid Approach (BEST)
1. Use `exclude_none=True` for primitives (they'll be omitted if None)
2. Use `.nullish()` in Zod for object/array fields that need to handle null explicitly

## Priority

1. **CRITICAL**: ChartProps.xAxis, ChartProps.yAxis, ChartProps.annotations
2. **MODERATE**: ChartProps.labels, ChartProps.colors, AxisXProps.ticks, GridProps.columns
3. **LOW**: All primitive Optional fields (if `exclude_none=True` is used, these become non-issues)

## Testing

After fixes, test with:
```python
# Test null serialization
chart = ChartProps(
    chartType=ChartType.bar,
    series=[ChartSeries(data=[1, 2, 3])],
    xAxis=None,
    yAxis=None,
    annotations=None
)
data = chart.model_dump()  # Should validate with Zod
```

