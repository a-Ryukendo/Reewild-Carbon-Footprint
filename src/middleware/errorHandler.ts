import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
  errors?: any[];
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default to 500 if status code not set
  const statusCode = err.statusCode || 500;
  
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
    });
  }

  // Don't leak error details in production
  const errorResponse = {
    error: err.name || 'InternalServerError',
    message: err.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(err.errors && { errors: err.errors }),
  };

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Cannot ${req.method} ${req.path}`,
  });};

export const asyncHandler = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
