import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../types';

export class HttpError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function notFound(message = 'Resource not found') {
  return new HttpError(404, 'not_found', message);
}

export function badRequest(message: string) {
  return new HttpError(400, 'bad_request', message);
}

export function unauthorized(message = 'Missing or invalid admin token') {
  return new HttpError(401, 'unauthorized', message);
}

export function notFoundHandler(req: Request, res: Response) {
  const body: ApiError = { error: 'not_found', message: `No route for ${req.method} ${req.path}` };
  res.status(404).json(body);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    const body: ApiError = { error: err.code, message: err.message };
    res.status(err.status).json(body);
    return;
  }
  console.error(err);
  const body: ApiError = { error: 'internal_error', message: 'Something went wrong' };
  res.status(500).json(body);
}
