import express from 'express';
import {
  getContactByIdController,
  deleteContactController,
  createContactController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

const contactRouter = express.Router();

contactRouter.get('/', getContactsController);
contactRouter.get('/:contactId', getContactByIdController);
contactRouter.delete('/:contactId', deleteContactController);
contactRouter.patch(
  '/:contactId',
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
contactRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

export default contactRouter;
contactRouter;
