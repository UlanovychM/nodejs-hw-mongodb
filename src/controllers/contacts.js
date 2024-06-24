import createHttpError from 'http-errors';

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
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

const setAuthContactId = (req) => {
  let authContactId = {};
  const { contactId } = req.params;
  const userId = req.user._id;
  if (contactId) {
    authContactId = { _id: contactId };
  }
  if (userId) {
    authContactId = { ...authContactId, userId: userId };
  }

  return authContactId;
};

export const getContactByIdController = async (req, res, next) => {
  const authContactId = setAuthContactId(req);
  const contact = await getContactById(authContactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const authContactId = setAuthContactId(req);
  const result = await patchContact(authContactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const authContactId = setAuthContactId(req);

  const contact = await deleteContact(authContactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
