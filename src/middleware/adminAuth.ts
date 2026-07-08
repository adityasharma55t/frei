import { NextFunction, Request, Response } from 'express';
import { unauthorized } from './errorHandler';

export function adminAuth(req: Request, _res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return next(unauthorized('Admin API is not configured (ADMIN_TOKEN not set)'));
  }

  const token = req.header('X-Admin-Token');
  if (!token || token !== expected) {
    return next(unauthorized());
  }

  next();
}
