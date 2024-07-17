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
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

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
  const userId = req.user._id;
  const file = req.file;

  let fileUrl;

  if (file) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      fileUrl = await saveFileToCloudinary(file);
    } else {
      fileUrl = await saveFileToUploadDir(file);
    }
  }

  const contact = await createContact({ ...req.body, photo: fileUrl, userId });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return next(createHttpError(401));
    }

    const { contactId } = req.params;
    const userId = user._id;

    const file = req.file;
    let fileUrl = null;

    if (file) {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        fileUrl = await saveFileToCloudinary(file);
      } else {
        fileUrl = await saveFileToUploadDir(file);
      }
    }

    const updateData = {
      ...req.body,
      photo: fileUrl,
    };

    const result = await updateContact(contactId, userId, updateData, {
      runValidators: true,
    });

    if (!result) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result.contact,
    });
  } catch (error) {
    next(createHttpError(500, 'Something went wrong', { data: error.message }));
  }
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
