import { Router } from 'express';
import { MODEL_REGISTRY, getModelDef } from '../utils/modelRegistry';
import { openapiDocument } from '../utils/openapiLoader';
import { validateRecord } from '../utils/validation';
import { listRecords, findRecord, createRecord, replaceRecord, deleteRecord } from '../utils/modelStore';
import { getPageParams, paginate } from '../utils/pagination';
import { badRequest, notFound } from '../middleware/errorHandler';

const router = Router();

// Resolves & validates :model once for every route below.
router.param('model', (_req, _res, next, model: string) => {
  const def = getModelDef(model);
  if (!def) return next(notFound(`Unknown model '${model}'`));
  next();
});

// GET /models
router.get('/models', (_req, res) => {
  const meta = MODEL_REGISTRY.map((def) => ({
    key: def.key,
    label: def.label,
    idField: def.idField,
    schema: openapiDocument.components.schemas[def.schemaName],
  }));
  res.json(meta);
});

// GET /models/:model?page=&limit=
router.get('/models/:model', (req, res) => {
  const records = listRecords(req.params.model) ?? [];
  res.json(paginate(records, getPageParams(req)));
});

// GET /models/:model/:id
router.get('/models/:model/:id', (req, res, next) => {
  const record = findRecord(req.params.model, req.params.id);
  if (!record) return next(notFound(`No '${req.params.model}' record with id '${req.params.id}'`));
  res.json(record);
});

// POST /models/:model
router.post('/models/:model', (req, res, next) => {
  const { model } = req.params;
  const result = validateRecord(model, req.body);
  if (!result.valid) return next(badRequest(result.errors.join('; ')));

  const created = createRecord(model, req.body as Record<string, unknown>);
  if (!created.ok) {
    const def = getModelDef(model)!;
    return next(badRequest(`A '${model}' record with ${def.idField} '${(req.body as any)[def.idField]}' already exists`));
  }

  res.status(201).json(created.record);
});

// PUT /models/:model/:id
router.put('/models/:model/:id', (req, res, next) => {
  const { model, id } = req.params;
  const def = getModelDef(model)!;
  const body = { ...(req.body as Record<string, unknown>), [def.idField]: id };

  const result = validateRecord(model, body);
  if (!result.valid) return next(badRequest(result.errors.join('; ')));

  const updated = replaceRecord(model, id, body);
  if (!updated) return next(notFound(`No '${model}' record with id '${id}'`));

  res.json(updated);
});

// DELETE /models/:model/:id
router.delete('/models/:model/:id', (req, res, next) => {
  const { model, id } = req.params;
  const removed = deleteRecord(model, id);
  if (!removed) return next(notFound(`No '${model}' record with id '${id}'`));
  res.json(removed);
});

export default router;
