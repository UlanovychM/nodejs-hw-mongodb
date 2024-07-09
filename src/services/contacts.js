import { ContactsCollection } from '../db/models/contacts.js';
import { SORT_ORDER } from '../constants/constants.js';
import { paginationData } from '../utils/paginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const contactsFilters = ContactsCollection.find({ userId });

  if (filter.isFavorite) {
    contactsFilters.where('isFavorite').equals(filter.isFavorite);
  }

  if (filter.contactType) {
    contactsFilters.where('contactType').equals(filter.contactType);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsFilters).countDocuments(),
    ContactsCollection.find()
      .merge(contactsFilters)
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationsData = paginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationsData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId,
  });
  return contact;
};

export const createContact = async (payload, userId, photo) => {
  const contact = await ContactsCollection.create({
    ...payload,
    userId: userId,
    photo,
  });
  return contact;
};

export const patchContact = async (
  contactId,
  { photo, ...payload },
  options = {},
  userId,
) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
      userId,
    },
    { ...payload, photo },
    { new: true, includeResultMetadata: true, ...options },
  ).where({ userId: userId });

  if (!rawResult || !rawResult.value) return null;
  return {
    student: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
