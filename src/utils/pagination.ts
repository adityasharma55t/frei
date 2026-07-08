import { Request } from 'express';
import { Paginated } from '../types';

export interface PageParams {
  page: number;
  limit: number;
}

/** Parses & clamps `page`/`limit` query params per the OpenAPI spec defaults. */
export function getPageParams(req: Request): PageParams {
  let page = parseInt(String(req.query.page ?? '1'), 10);
  let limit = parseInt(String(req.query.limit ?? '20'), 10);

  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 20;
  if (limit > 100) limit = 100;

  return { page, limit };
}

export function paginate<T>(items: T[], { page, limit }: PageParams): Paginated<T> {
  const start = (page - 1) * limit;
  return {
    total: items.length,
    items: items.slice(start, start + limit),
  };
}
