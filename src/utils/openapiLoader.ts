import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// src/utils -> repo root and dist/utils -> repo root are both two levels up,
// so this resolves correctly whether running compiled dist/ code or ts-node
// against src/ directly — no need to copy the yaml file into dist/.
const SPEC_PATH = path.join(__dirname, '..', '..', 'frei-booking-api_openapi.yaml');

export const openapiDocument: Record<string, any> = yaml.load(
  fs.readFileSync(SPEC_PATH, 'utf-8')
) as Record<string, any>;
