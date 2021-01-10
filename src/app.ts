import dotenv from 'dotenv';
import config from './config';
import express from 'express';
import ErrorHandler from './utils/errorHandler';
import errorMiddleware from './middlewares/errors';

import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';

import { registRoutes } from '@/routes';

dotenv.config();

const app = express();

const sess = {
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  secret: config.session.secret,
};

if (config.node_env === 'development') {
  app.use(logger('dev')); // Log level
}

if (config.node_env === 'production') {
  app.use(logger('combined')); // Log level
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use([
  rateLimit({ windowMs: 10 * 60 * 1000, max: 100 }),

  helmet(),
  hpp(),
  cookieParser(),
  cors(),
  express.json({ limit: '10kb' }),
  express.urlencoded({ extended: true, limit: '10kb', type: 'application/json' }),
]);

// Router
app.use(registRoutes);

app.get('/ping', async (req, res) => {
  res.send({
    message: 'pong',
  });
});

app.all('*', (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

app.use(errorMiddleware);

const server = app.listen(config.port, () => {
  console.log(`⚡Serer Listening on port ${config.port}`);
});

process.on('uncaughtException', (err: Error) => {
  console.log(`ERROR: ${err.message}`);
  console.log('Shutting down due to uncaught exception.');
  process.exitCode = 1;
});

process.on('unhandledRejection', (err: Error) => {
  console.log(`Error ${err.message}`);
  console.log('Shutting down the server due to handled promise rejection.');
  server.close(() => {
    process.exitCode = 1;
  });
});
