import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import mongoose from 'mongoose';
import { env } from './utils/env.js';
// import { ENV_VARS } from './db/initMongoConnection.js';
import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = env('PORT', '3000');

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      data: contacts,
      status: 200,
      message: 'Successfully found contacts!',
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        data: 'Id is not valid',
      });
    }
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: `Contact with id ${contactId} not found`,
      });
    }
    res.status(200).json({
      data: contact,
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
