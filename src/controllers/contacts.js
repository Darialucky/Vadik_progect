import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

import createHttpError from 'http-errors';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

import mongoose from 'mongoose';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  res.status(200).json({
    data: contacts,
    status: 200,
    message: 'Successfully found contacts!',
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({
      data: 'Id is not valid',
    });
  }
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    next(createHttpError(404, 'Not found'));
    return;
  }
  res.status(200).json({
    data: contact,
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user.id;
  const contact = await createContact({ ...req.body, userId });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const result = await updateContact(contactId, req.body, userId);
  if (!result) {
    next(createHttpError(404, 'Not found'));
    return;
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({
      data: 'Id is not valid',
    });
  }
  const contact = await deleteContact(contactId, userId);
  if (!contact) {
    next(createHttpError(404, 'Not found'));
    return;
  }
  res.status(204).send();
};
