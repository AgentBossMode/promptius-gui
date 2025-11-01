/**
 * Promptius GUI Zod Schemas - Runtime validation schemas for UI components
 * 
 * This file is auto-generated from schema/promptius-gui-schema.json
 * DO NOT EDIT MANUALLY - Use scripts/generate-zod.sh to regenerate
 */

import { z } from 'zod';

// Main UI Schema
export const UISchema = z.object({
    metadata: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    version: z.string().regex(/^\d+\.\d+\.\d+$/).default("1.0.0"),
    framework: z.enum(["shadcn", "material-ui", "chakra-ui", "ant-design"]).default("shadcn"),
    rootId: z.string().min(1)
  }).strict(),
    nodes: z.array(z.union([z.object({
    id: z.string().min(1),
    type: z.literal("button"),
    props: z.object({
    label: z.string().min(1),
    variant: z.enum(["primary", "secondary", "outline", "ghost", "destructive"]).default("primary"),
    size: z.enum(["sm", "md", "lg"]).default("md"),
    disabled: z.boolean().default(false),
    fullWidth: z.boolean().default(false),
    loading: z.boolean().default(false)
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("input"),
    props: z.object({
    placeholder: z.string().default(""),
    type: z.enum(["text", "email", "password", "number", "tel", "url", "search", "date"]).default("text"),
    size: z.enum(["sm", "md", "lg"]).default("md"),
    disabled: z.boolean().default(false),
    required: z.boolean().default(false),
    label: z.string().optional(),
    helperText: z.string().optional(),
    defaultValue: z.string().optional(),
    maxLength: z.number().int().min(1).optional(),
    minLength: z.number().int().min(0).optional()
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("textarea"),
    props: z.object({
    placeholder: z.string().default(""),
    rows: z.number().int().min(1).max(20).default(4),
    disabled: z.boolean().default(false),
    required: z.boolean().default(false),
    label: z.string().optional(),
    helperText: z.string().optional(),
    maxLength: z.number().int().min(1).optional()
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("text"),
    props: z.object({
    content: z.string(),
    tag: z.enum(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "label"]).default("p"),
    align: z.enum(["left", "center", "right", "justify"]).default("left"),
    bold: z.boolean().default(false),
    italic: z.boolean().default(false),
    color: z.string().regex(/^(#[0-9A-Fa-f]{6}|[a-z\-]+)$/).optional()
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("card"),
    props: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    elevation: z.number().int().min(0).max(5).default(1),
    padding: z.number().int().min(0).max(64).default(16)
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("alert"),
    props: z.object({
    message: z.string().min(1),
    title: z.string().optional(),
    variant: z.enum(["info", "success", "warning", "error"]).default("info"),
    dismissible: z.boolean().default(false)
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("container"),
    props: z.object({
    maxWidth: z.number().int().min(320).max(1920).optional(),
    padding: z.number().int().min(0).max(64).default(16),
    centered: z.boolean().default(false)
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("grid"),
    props: z.object({
    columns: z.number().int().min(1).max(12).default(1),
    gap: z.number().int().min(0).max(64).default(16),
    responsive: z.boolean().default(true)
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("stack"),
    props: z.object({
    direction: z.enum(["row", "column"]).default("column"),
    gap: z.number().int().min(0).max(64).default(8),
    align: z.enum(["start", "center", "end", "stretch"]).default("stretch")
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("chart"),
    props: z.object({
    chartType: z.enum(["bar", "line", "pie"]),
    width: z.number().int().min(100).max(4000).optional(),
    height: z.number().int().min(100).max(4000).optional(),
    labels: z.array(z.string()).nullish(),
    series: z.array(z.object({
    name: z.any().optional(),
    data: z.any()
  }).strict()).min(1),
    colors: z.array(z.string()).nullish(),
    title: z.string().optional(),
    showLegend: z.boolean().default(true),
    legendPosition: z.enum(["top", "right", "bottom", "left"]).default("top"),
    xAxis: z.object({
    label: z.string().optional(),
    ticks: z.array(z.any()).nullish(),
    showGrid: z.boolean().default(false)
  }).strict().nullish(),
    yAxis: z.object({
    label: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    showGrid: z.boolean().default(false)
  }).strict().nullish(),
    annotations: z.array(z.object({
    x: z.any().optional(),
    y: z.any().optional(),
    label: z.any()
  }).strict()).nullish()
  }).strict()
  }).strict()])).min(1),
    edges: z.array(z.object({
    src: z.string().min(1),
    dest: z.string().min(1),
    order: z.number().int().min(0)
  }).strict()),
    events: z.array(z.object({
    nodeId: z.string().min(1),
    eventType: z.enum(["onClick", "onSubmit", "onChange", "onFocus", "onBlur"]),
    action: z.union([z.object({
    type: z.literal("navigate"),
    url: z.string().min(1),
    target: z.enum(["_self", "_blank"]).default("_self")
  }).strict(), z.object({
    type: z.literal("setState"),
    key: z.string().min(1),
    value: z.union([z.string(), z.number(), z.boolean()])
  }).strict(), z.object({
    type: z.literal("submitForm"),
    endpoint: z.string().optional(),
    method: z.enum(["POST", "PUT", "PATCH"]).default("POST")
  }).strict(), z.object({
    type: z.literal("validate"),
    rules: z.array(z.string()).default([])
  }).strict(), z.object({
    type: z.literal("custom"),
    handler: z.string().min(1)
  }).strict()])
  }).strict())
  }).strict();

// Individual component schemas
export const ButtonVariantSchema = z.enum(["primary", "secondary", "outline", "ghost", "destructive"]);

export const ButtonSizeSchema = z.enum(["sm", "md", "lg"]);

export const ButtonPropsSchema = z.object({
    label: z.string().min(1),
    variant: z.enum(["primary", "secondary", "outline", "ghost", "destructive"]).default("primary"),
    size: z.enum(["sm", "md", "lg"]).default("md"),
    disabled: z.boolean().default(false),
    fullWidth: z.boolean().default(false),
    loading: z.boolean().default(false)
  }).strict();

export const InputTypeSchema = z.enum(["text", "email", "password", "number", "tel", "url", "search", "date"]);

export const InputSizeSchema = z.enum(["sm", "md", "lg"]);

export const InputPropsSchema = z.object({
    placeholder: z.string().default(""),
    type: z.enum(["text", "email", "password", "number", "tel", "url", "search", "date"]).default("text"),
    size: z.enum(["sm", "md", "lg"]).default("md"),
    disabled: z.boolean().default(false),
    required: z.boolean().default(false),
    label: z.string().optional(),
    helperText: z.string().optional(),
    defaultValue: z.string().optional(),
    maxLength: z.number().int().min(1).optional(),
    minLength: z.number().int().min(0).optional()
  }).strict();

export const AlertVariantSchema = z.enum(["info", "success", "warning", "error"]);

export const AlertPropsSchema = z.object({
    message: z.string().min(1),
    title: z.string().optional(),
    variant: z.enum(["info", "success", "warning", "error"]).default("info"),
    dismissible: z.boolean().default(false)
  }).strict();

export const TextTagSchema = z.enum(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "label"]);

export const AlignTextSchema = z.enum(["left", "center", "right", "justify"]);

export const TextPropsSchema = z.object({
    content: z.string(),
    tag: z.enum(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "label"]).default("p"),
    align: z.enum(["left", "center", "right", "justify"]).default("left"),
    bold: z.boolean().default(false),
    italic: z.boolean().default(false),
    color: z.string().regex(/^(#[0-9A-Fa-f]{6}|[a-z\-]+)$/).optional()
  }).strict();

export const FlexDirectionSchema = z.enum(["row", "column"]);

export const ChartTypeSchema = z.enum(["bar", "line", "pie"]);

export const ChartPropsSchema = z.object({
    chartType: z.enum(["bar", "line", "pie"]),
    width: z.number().int().min(100).max(4000).optional(),
    height: z.number().int().min(100).max(4000).optional(),
    labels: z.array(z.string()).nullish(),
    series: z.array(z.object({
    name: z.string().optional(),
    data: z.array(z.number()).min(1)
  }).strict()).min(1),
    colors: z.array(z.string()).nullish(),
    title: z.string().optional(),
    showLegend: z.boolean().default(true),
    legendPosition: z.enum(["top", "right", "bottom", "left"]).default("top"),
    xAxis: z.object({
    label: z.string().optional(),
    ticks: z.array(z.string()).nullish(),
    showGrid: z.boolean().default(false)
  }).strict().nullish(),
    yAxis: z.object({
    label: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    showGrid: z.boolean().default(false)
  }).strict().nullish(),
    annotations: z.array(z.object({
    x: z.number().optional(),
    y: z.number().optional(),
    label: z.string()
  }).strict()).nullish()
  }).strict();

export const EventTypeSchema = z.enum(["onClick", "onSubmit", "onChange", "onFocus", "onBlur"]);

export const NavigateActionSchema = z.object({
    type: z.literal("navigate"),
    url: z.string().min(1),
    target: z.enum(["_self", "_blank"]).default("_self")
  }).strict();

export const SetStateActionSchema = z.object({
    type: z.literal("setState"),
    key: z.string().min(1),
    value: z.union([z.string(), z.number(), z.boolean()])
  }).strict();

export const SubmitFormActionSchema = z.object({
    type: z.literal("submitForm"),
    endpoint: z.string().optional(),
    method: z.enum(["POST", "PUT", "PATCH"]).default("POST")
  }).strict();

export const NodeSchema = z.union([z.object({
    id: z.string().min(1),
    type: z.literal("button"),
    props: z.object({
    label: z.string().min(1),
    variant: z.enum(["primary", "secondary", "outline", "ghost", "destructive"]).default("primary"),
    size: z.enum(["sm", "md", "lg"]).default("md"),
    disabled: z.boolean().default(false),
    fullWidth: z.boolean().default(false),
    loading: z.boolean().default(false)
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("input"),
    props: z.object({
    placeholder: z.string().default(""),
    type: z.enum(["text", "email", "password", "number", "tel", "url", "search", "date"]).default("text"),
    size: z.enum(["sm", "md", "lg"]).default("md"),
    disabled: z.boolean().default(false),
    required: z.boolean().default(false),
    label: z.string().optional(),
    helperText: z.string().optional(),
    defaultValue: z.string().optional(),
    maxLength: z.number().int().min(1).optional(),
    minLength: z.number().int().min(0).optional()
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("textarea"),
    props: z.object({
    placeholder: z.string().default(""),
    rows: z.number().int().min(1).max(20).default(4),
    disabled: z.boolean().default(false),
    required: z.boolean().default(false),
    label: z.string().optional(),
    helperText: z.string().optional(),
    maxLength: z.number().int().min(1).optional()
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("text"),
    props: z.object({
    content: z.string(),
    tag: z.enum(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "label"]).default("p"),
    align: z.enum(["left", "center", "right", "justify"]).default("left"),
    bold: z.boolean().default(false),
    italic: z.boolean().default(false),
    color: z.string().regex(/^(#[0-9A-Fa-f]{6}|[a-z\-]+)$/).optional()
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("card"),
    props: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    elevation: z.number().int().min(0).max(5).default(1),
    padding: z.number().int().min(0).max(64).default(16)
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("alert"),
    props: z.object({
    message: z.string().min(1),
    title: z.string().optional(),
    variant: z.enum(["info", "success", "warning", "error"]).default("info"),
    dismissible: z.boolean().default(false)
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("container"),
    props: z.object({
    maxWidth: z.number().int().min(320).max(1920).optional(),
    padding: z.number().int().min(0).max(64).default(16),
    centered: z.boolean().default(false)
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("grid"),
    props: z.object({
    columns: z.number().int().min(1).max(12).default(1),
    gap: z.number().int().min(0).max(64).default(16),
    responsive: z.boolean().default(true)
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("stack"),
    props: z.object({
    direction: z.enum(["row", "column"]).default("column"),
    gap: z.number().int().min(0).max(64).default(8),
    align: z.enum(["start", "center", "end", "stretch"]).default("stretch")
  }).strict()
  }).strict(), z.object({
    id: z.string().min(1),
    type: z.literal("chart"),
    props: z.object({
    chartType: z.enum(["bar", "line", "pie"]),
    width: z.number().int().min(100).max(4000).optional(),
    height: z.number().int().min(100).max(4000).optional(),
    labels: z.array(z.string()).nullish(),
    series: z.array(z.object({
    name: z.string().optional(),
    data: z.array(z.number()).min(1)
  }).strict()).min(1),
    colors: z.array(z.string()).nullish(),
    title: z.string().optional(),
    showLegend: z.boolean().default(true),
    legendPosition: z.enum(["top", "right", "bottom", "left"]).default("top"),
    xAxis: z.object({
    label: z.string().optional(),
    ticks: z.array(z.string()).nullish(),
    showGrid: z.boolean().default(false)
  }).strict().nullish(),
    yAxis: z.object({
    label: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    showGrid: z.boolean().default(false)
  }).strict().nullish(),
    annotations: z.array(z.object({
    x: z.number().optional(),
    y: z.number().optional(),
    label: z.string()
  }).strict()).nullish()
  }).strict()
  }).strict()]);

export const EdgeSchema = z.object({
    src: z.string().min(1),
    dest: z.string().min(1),
    order: z.number().int().min(0)
  }).strict();

export const EventSchema = z.object({
    nodeId: z.string().min(1),
    eventType: z.enum(["onClick", "onSubmit", "onChange", "onFocus", "onBlur"]),
    action: z.union([z.object({
    type: z.literal("navigate"),
    url: z.string().min(1),
    target: z.enum(["_self", "_blank"]).default("_self")
  }).strict(), z.object({
    type: z.literal("setState"),
    key: z.string().min(1),
    value: z.union([z.string(), z.number(), z.boolean()])
  }).strict(), z.object({
    type: z.literal("submitForm"),
    endpoint: z.string().optional(),
    method: z.enum(["POST", "PUT", "PATCH"]).default("POST")
  }).strict(), z.object({
    type: z.literal("validate"),
    rules: z.array(z.string()).default([])
  }).strict(), z.object({
    type: z.literal("custom"),
    handler: z.string().min(1)
  }).strict()])
  }).strict();

export const UIMetadataSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    version: z.string().regex(/^\d+\.\d+\.\d+$/).default("1.0.0"),
    framework: z.enum(["shadcn", "material-ui", "chakra-ui", "ant-design"]).default("shadcn"),
    rootId: z.string().min(1)
  }).strict();
