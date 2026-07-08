import { getModelDef } from './modelRegistry';
import { getStore, persistModel } from './dataStore';

type Record_ = Record<string, unknown>;

export function listRecords(modelKey: string): Record_[] | undefined {
  return getStore(modelKey) as Record_[] | undefined;
}

export function findRecord(modelKey: string, id: string): Record_ | undefined {
  const def = getModelDef(modelKey);
  const records = getStore(modelKey) as Record_[] | undefined;
  if (!def || !records) return undefined;
  return records.find((r) => String(r[def.idField]) === id);
}

export function createRecord(
  modelKey: string,
  record: Record_
): { ok: true; record: Record_ } | { ok: false; reason: 'duplicate' } {
  const def = getModelDef(modelKey);
  const records = getStore(modelKey) as Record_[] | undefined;
  if (!def || !records) throw new Error(`Unknown model '${modelKey}'`);

  const id = String(record[def.idField]);
  if (records.some((r) => String(r[def.idField]) === id)) {
    return { ok: false, reason: 'duplicate' };
  }
  records.push(record);
  persistModel(modelKey);
  return { ok: true, record };
}

export function replaceRecord(modelKey: string, id: string, record: Record_): Record_ | undefined {
  const def = getModelDef(modelKey);
  const records = getStore(modelKey) as Record_[] | undefined;
  if (!def || !records) return undefined;

  const idx = records.findIndex((r) => String(r[def.idField]) === id);
  if (idx === -1) return undefined;

  records[idx] = record;
  persistModel(modelKey);
  return record;
}

export function deleteRecord(modelKey: string, id: string): Record_ | undefined {
  const def = getModelDef(modelKey);
  const records = getStore(modelKey) as Record_[] | undefined;
  if (!def || !records) return undefined;

  const idx = records.findIndex((r) => String(r[def.idField]) === id);
  if (idx === -1) return undefined;

  const [removed] = records.splice(idx, 1);
  persistModel(modelKey);
  return removed;
}
