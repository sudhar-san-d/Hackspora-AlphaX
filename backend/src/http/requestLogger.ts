import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

export const requestLogger: RequestHandler = (request, response, next) => {
  const started = performance.now();
  const requestId = request.header('x-request-id')?.slice(0, 100) || randomUUID();
  response.setHeader('x-request-id', requestId);
  response.on('finish', () => {
    const event = { level: 'info', requestId, method: request.method, path: request.path, status: response.statusCode, durationMs: Math.round((performance.now() - started) * 10) / 10 };
    console.info(JSON.stringify(event));
  });
  next();
};
