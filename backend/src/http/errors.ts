import type { ErrorRequestHandler, RequestHandler } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string, public readonly details?: unknown) { super(message); }
}

export const notFound: RequestHandler = (_request, _response, next) => next(new AppError(404, 'NOT_FOUND', 'Route not found'));

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Request validation failed', details: error.issues } });
    return;
  }
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    response.status(status).json({ success: false, error: { code: 'UPLOAD_ERROR', message: error.message } });
    return;
  }
  if (error instanceof AppError) {
    response.status(error.status).json({ success: false, error: { code: error.code, message: error.message, ...(error.details === undefined ? {} : { details: error.details }) } });
    return;
  }
  const message = error instanceof Error && process.env.NODE_ENV !== 'production' ? error.message : 'Internal server error';
  response.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message } });
};
