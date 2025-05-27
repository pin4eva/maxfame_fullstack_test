import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  stack?: string;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { name: 'CastError', message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { name: 'DuplicateError', message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = { name: 'ValidationError', message, statusCode: 400 };
  }

  const response: ErrorResponse = {
    success: false,
    message: error.message || 'Server Error'
  };

  if (process.env.NODE_ENV === 'development') {
    response.error = err.message;
    response.stack = err.stack;
  }

  res.status(error.statusCode || 500).json(response);
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};