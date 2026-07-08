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

// Lets Swagger UI's "Try it out" default to wherever this instance is
// actually reachable, without hand-editing the yaml's hardcoded server list
// per deployment (e.g. a Render preview URL, a custom domain, ngrok, etc).
const serviceUrl = process.env.SERVICE_URL;
if (serviceUrl) {
  openapiDocument.servers = [
    { url: serviceUrl, description: 'Current (from SERVICE_URL)' },
    ...(openapiDocument.servers ?? []),
  ];
}
