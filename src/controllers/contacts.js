import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { env } from '../utils/env.js';

import {
  getAllContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact,
} from '../services/contacts.js';

import { filterParams } from '../utils/filterParams.js';
import { sortParams } from '../utils/sortParams.js';
import { paginationParams } from '../utils/paginationParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = paginationParams(req.query);
  const { sortBy, sortOrder } = sortParams(req.query);
  const filter = filterParams(req.query);

  if (req.user) {
    filter.userId = req.user._id;
  }

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(404).json({
      status: 404,
      message: 'Not valid contact id',
    });
  }

  try {
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
export const createContactController = async (req, res) => {
  const { body } = req;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'TRUE') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await createContact(body, req.user._id, photoUrl);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'TRUE') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await patchContact(
    contactId,
    { ...req.body, photo: photoUrl },
    req.user._id,
  );
  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send({
    status: 204,
  });
};
