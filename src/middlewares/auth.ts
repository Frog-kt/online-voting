import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import catchAsyncErrors from './catchAsyncErrors';
import ErrorHandler from '../utils/errorHandler';
import config from '../config';

import Role from '../utils/role';

export interface IJwtData {
  id: string;
  role: Role[];
}

export const requireAuth = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ErrorHandler('Login first to access this resource.', 401));
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    req.user.id = (decoded as IJwtData).id;
    next();
  },
);
