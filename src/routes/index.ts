import { Express } from 'express';
import authRouter from './auth';
import voteRouter from './vote';

export function registRoutes(app: Express): void {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/vote', voteRouter);
}
