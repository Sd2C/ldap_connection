import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { handleZodError } from '../utils/errorHandler';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = handleZodError(error);
        return res.status(validationError.statusCode).json({
          success: false,
          errorMessage: validationError.message,
        });
      }
      return next(error);
    }
  };
};