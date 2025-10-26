#!/usr/bin/env node

/**
 * Zod Schema Generation Script
 * Uses custom generator for better reference resolution
 */

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get project root (parent of scripts directory)
const PROJECT_ROOT = dirname(__dirname);
const CUSTOM_GENERATOR = join(__dirname, 'custom-zod-generator.mjs');

console.log('🔍 Generating detailed Zod schemas from JSON Schema...');

try {
  // Run the custom generator
  execSync(`node "${CUSTOM_GENERATOR}"`, { 
    stdio: 'inherit',
    cwd: PROJECT_ROOT 
  });
  
  console.log('✅ Zod schema generation completed!');
  
} catch (error) {
  console.error('❌ Error generating Zod schemas:', error.message);
  process.exit(1);
}
