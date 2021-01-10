import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction): void => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    error.message = err.message;

    // MongoDBのオブジェクトが無い時のエラー
    if (err.name === 'CastError') {
      const message = `Resource not found. Invalid ${err.path}`;
      error = new ErrorHandler(message, 404);
    }

    // MongoDBのバリデーションエラー
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map((value) => value.message)
        .toString();
      error = new ErrorHandler(message, 400);
    }

    // MongoDBの主キー重複時エラー
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
      error = new ErrorHandler(message, 400);
    }

    // JWTのトークンエラー
    if (err.name === 'JsonWebTokenError') {
      const message = 'JWT Token is invalid. Try Again!';
      error = new ErrorHandler(message, 500);
    }

    // JWTの期限切れエラー
    if (err.name === 'TokenExpiredError') {
      const message = 'JWT Token is expired. Try Again!';
      error = new ErrorHandler(message, 500);
    }

    // KMSの暗号鍵エラー
    if (err.name === 'InvalidCiphertextException') {
      const message = 'Invalid ciphertext exception.';
      error = new ErrorHandler(message, 500);
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error.',
    });
  }

  err.message = err.message || 'Internal Server Error.';

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;
