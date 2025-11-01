#!/usr/bin/env node

/**
 * Custom Zod Schema Generator
 * Manually converts JSON Schema to Zod with proper reference resolution
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get project root (parent of scripts directory)
const PROJECT_ROOT = dirname(__dirname);
const SCHEMA_FILE = join(PROJECT_ROOT, 'schema', 'promptius-gui-schema.json');
const OUTPUT_FILE = join(PROJECT_ROOT, 'js', 'packages', 'schemas', 'src', 'zod.ts');

console.log('🔍 Generating detailed Zod schemas from JSON Schema...');

// Helper function to resolve $ref references
function resolveRef(schema, ref, definitions) {
  if (!ref.startsWith('#/$defs/')) {
    throw new Error(`Unsupported ref: ${ref}`);
  }
  const defName = ref.replace('#/$defs/', '');
  return definitions[defName];
}

// Helper function to check if a schema represents an object or array type
// (needed to determine if we should use .nullish() vs .optional())
function isObjectOrArrayType(schema, definitions, depth = 0) {
  if (depth > 10) return false;
  
  // Handle $ref by resolving and checking the resolved type
  if (schema.$ref) {
    const resolved = resolveRef(schema, schema.$ref, definitions);
    return isObjectOrArrayType(resolved, definitions, depth + 1);
  }
  
  // Direct type check
  if (schema.type === 'object' || schema.type === 'array') {
    return true;
  }
  
  // Check oneOf/anyOf for object/array types
  if (schema.oneOf || schema.anyOf) {
    const options = schema.oneOf || schema.anyOf;
    return options.some(option => isObjectOrArrayType(option, definitions, depth + 1));
  }
  
  return false;
}

// Convert JSON Schema type to Zod
function jsonSchemaToZod(schema, definitions, depth = 0) {
  if (depth > 10) {
    return 'z.any()';
  }

  // Handle $ref
  if (schema.$ref) {
    const resolved = resolveRef(schema, schema.$ref, definitions);
    return jsonSchemaToZod(resolved, definitions, depth + 1);
  }

  // Handle oneOf
  if (schema.oneOf) {
    const options = schema.oneOf.map(option => 
      jsonSchemaToZod(option, definitions, depth + 1)
    );
    return `z.union([${options.join(', ')}])`;
  }

  // Handle anyOf
  if (schema.anyOf) {
    const options = schema.anyOf.map(option => 
      jsonSchemaToZod(option, definitions, depth + 1)
    );
    return `z.union([${options.join(', ')}])`;
  }

  // Handle const
  if (schema.const !== undefined) {
    return `z.literal(${JSON.stringify(schema.const)})`;
  }

  // Handle enum
  if (schema.enum) {
    const enumValues = schema.enum.map(val => JSON.stringify(val)).join(', ');
    return `z.enum([${enumValues}])`;
  }

  // Handle string
  if (schema.type === 'string') {
    let zod = 'z.string()';
    if (schema.minLength) {
      zod += `.min(${schema.minLength})`;
    }
    if (schema.maxLength) {
      zod += `.max(${schema.maxLength})`;
    }
    if (schema.pattern) {
      zod += `.regex(/${schema.pattern}/)`;
    }
    return zod;
  }

  // Handle number
  if (schema.type === 'number' || schema.type === 'integer') {
    let zod = schema.type === 'integer' ? 'z.number().int()' : 'z.number()';
    if (schema.minimum !== undefined) {
      zod += `.min(${schema.minimum})`;
    }
    if (schema.maximum !== undefined) {
      zod += `.max(${schema.maximum})`;
    }
    return zod;
  }

  // Handle boolean
  if (schema.type === 'boolean') {
    return 'z.boolean()';
  }

  // Handle array
  if (schema.type === 'array') {
    const items = schema.items ? jsonSchemaToZod(schema.items, definitions, depth + 1) : 'z.any()';
    let zod = `z.array(${items})`;
    if (schema.minItems) {
      zod += `.min(${schema.minItems})`;
    }
    if (schema.maxItems) {
      zod += `.max(${schema.maxItems})`;
    }
    return zod;
  }

  // Handle object
  if (schema.type === 'object') {
    const properties = schema.properties || {};
    const required = schema.required || [];
    
    const shapeEntries = Object.entries(properties).map(([key, propSchema]) => {
      const zodType = jsonSchemaToZod(propSchema, definitions, depth + 1);
      const isRequired = required.includes(key);
      const hasDefault = propSchema.default !== undefined;
      const isObjectOrArray = isObjectOrArrayType(propSchema, definitions);
      
      let zod = zodType;
      if (hasDefault) {
        zod += `.default(${JSON.stringify(propSchema.default)})`;
      }
      if (!isRequired && !hasDefault) {
        // Use .nullish() for object/array types to handle Pydantic's null serialization
        // .nullish() allows both null and undefined, while .optional() only allows undefined
        if (isObjectOrArray) {
          zod += '.nullish()';
        } else {
          zod += '.optional()';
        }
      }
      
      return `    ${key}: ${zod}`;
    });

    let zod = `z.object({\n${shapeEntries.join(',\n')}\n  })`;
    
    if (schema.additionalProperties === false) {
      zod += '.strict()';
    }
    
    return zod;
  }

  // Fallback
  return 'z.any()';
}

try {
  const schemaContent = readFileSync(SCHEMA_FILE, 'utf8');
  const schema = JSON.parse(schemaContent);
  
  console.log('📋 Schema file found:', SCHEMA_FILE);
  console.log('📊 Schema version:', schema.version || 'unknown');
  
  const definitions = schema.$defs || {};
  console.log('📚 Found', Object.keys(definitions).length, 'definitions');
  
  // Generate the main schema
  const mainSchema = jsonSchemaToZod(schema, definitions);
  
  // Generate individual component schemas
  const componentSchemas = [];
  
  // Generate schemas for key components
  const keyComponents = [
    'ButtonVariant', 'ButtonSize', 'ButtonProps',
    'InputType', 'InputSize', 'InputProps',
    'AlertVariant', 'AlertProps',
    'TextTag', 'AlignText', 'TextProps',
    'FlexDirection', 'FlexProps',
    'ChartType', 'ChartProps',
    'EventType', 'NavigateAction', 'SetStateAction', 'SubmitFormAction',
    'Node', 'Edge', 'Event', 'UIMetadata'
  ];
  
  for (const componentName of keyComponents) {
    if (definitions[componentName]) {
      const zodSchema = jsonSchemaToZod(definitions[componentName], definitions);
      componentSchemas.push(`export const ${componentName}Schema = ${zodSchema};`);
    }
  }
  
  // Create the output content
  const outputContent = `/**
 * Promptius GUI Zod Schemas - Runtime validation schemas for UI components
 * 
 * This file is auto-generated from schema/promptius-gui-schema.json
 * DO NOT EDIT MANUALLY - Use scripts/generate-zod.sh to regenerate
 */

import { z } from 'zod';

// Main UI Schema
export const UISchema = ${mainSchema};

// Individual component schemas
${componentSchemas.join('\n\n')}
`;
  
  // Ensure output directory exists
  const outputDir = dirname(OUTPUT_FILE);
  try {
    require('fs').mkdirSync(outputDir, { recursive: true });
  } catch (err) {
    // Directory might already exist, ignore error
  }
  
  // Write the generated schema
  writeFileSync(OUTPUT_FILE, outputContent, 'utf8');
  
  console.log('✅ Detailed Zod schema generation completed!');
  console.log('📁 Output:', OUTPUT_FILE);
  console.log('📊 Generated', componentSchemas.length, 'component schemas');
  
} catch (error) {
  console.error('❌ Error generating Zod schemas:', error.message);
  process.exit(1);
}
