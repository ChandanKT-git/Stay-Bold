import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return res.status(400).json({
      message: 'Validation Error',
      errors
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value',
      error: 'This value already exists'
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }

  res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error'
  });
};