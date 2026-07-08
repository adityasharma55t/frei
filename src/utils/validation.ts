import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { MODEL_REGISTRY } from './modelRegistry';
import { openapiDocument } from './openapiLoader';

/**
 * OpenAPI's `nullable: true` isn't a JSON Schema keyword Ajv understands —
 * rewrite it into `type: [X, 'null']` before compiling.
 */
function convertNullable(schema: unknown): unknown {
  if (Array.isArray(schema)) {
    return schema.map(convertNullable);
  }
  if (schema && typeof schema === 'object') {
    const obj = { ...(schema as Record<string, unknown>) };
    for (const key of ['properties', 'items', 'allOf', 'oneOf', 'anyOf']) {
      if (obj[key]) obj[key] = convertNullable(obj[key]);
    }
    if (obj.nullable === true) {
      delete obj.nullable;
      const t = obj.type;
      obj.type = Array.isArray(t) ? [...t, 'null'] : [t, 'null'];
    }
    return obj;
  }
  return schema;
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validators: Record<string, ValidateFunction> = {};

for (const def of MODEL_REGISTRY) {
  const schema = openapiDocument.components.schemas[def.schemaName];
  validators[def.key] = ajv.compile(convertNullable(JSON.parse(JSON.stringify(schema))) as object);
}

export function validateRecord(
  modelKey: string,
  body: unknown
): { valid: true } | { valid: false; errors: string[] } {
  const validate = validators[modelKey];
  if (!validate) return { valid: false, errors: [`Unknown model '${modelKey}'`] };

  const valid = validate(body);
  if (valid) return { valid: true };

  const errors = (validate.errors ?? []).map((e) => `${e.instancePath || '(root)'} ${e.message}`);
  return { valid: false, errors };
}
