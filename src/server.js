import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
// import mongoose from 'mongoose';
import { env } from './utils/env.js';
// import { ENV_VARS } from './db/initMongoConnection.js';
// import { getAllContacts, getContactById } from './services/contacts.js';
import contactRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = env('PORT', '3000');

export const setupServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(contactRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
