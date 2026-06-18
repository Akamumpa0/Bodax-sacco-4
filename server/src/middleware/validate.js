import { AppError } from '../utils/AppError.js';

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      next(new AppError('Validation failed', 400, result.error.flatten()));
      return;
    }

    req.validated = result.data;
    next();
  };
}
