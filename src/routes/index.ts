import { Express } from 'express';
import authRouter from './auth';

export function registRoutes(app: Express) {
  app.use('/api/v1/auth', authRouter);
}
