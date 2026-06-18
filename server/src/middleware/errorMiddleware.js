import { env } from '../config/env.js';

export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorMiddleware(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const response = {
    message: statusCode === 500 ? 'Something went wrong' : error.message,
  };

  if (error.details) response.details = error.details;
  if (env.nodeEnv === 'development') response.stack = error.stack;

  res.status(statusCode).json(response);
}
