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

import { authenticate } from '../middlewares/authenticate.js';
import { checkUserTokenId } from '../middlewares/checkUserTokenId.js';
import { upload } from '../middlewares/multer.js';

const contactRouter = express.Router();

contactRouter.use(authenticate);
contactRouter.use('/:contactId', checkUserTokenId);

contactRouter.get('/', getContactsController);
contactRouter.get('/:contactId', getContactByIdController);
contactRouter.delete('/:contactId', deleteContactController);

contactRouter.patch(
  '/:contactId',
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

contactRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

export default contactRouter;
