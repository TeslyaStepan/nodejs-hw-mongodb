import { contactsCollection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../contacts/index.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = "_id",
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactsCollection.find();

  if (filter.type) {
    contactsQuery.where("type").equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsQuery.where("isFavourite").equals(filter.isFavourite);
  }

  const [contactCount, contacts] = await Promise.all([
    contactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactCount, page, perPage);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contact = await contactsCollection.findById(contactId);
  return contact;
};

export const postNewContact = async (payload) => {
  const contact = await contactsCollection.create(payload);
  return contact;
};

export const patchContact = async (contactId, payload, options = {}) => {
  const rawResult = await contactsCollection.findByIdAndUpdate(
    { _id: contactId },
    payload,
    { new: true, includeResultMetadata: true, ...options }
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId) => {
  const contact = await contactsCollection.findOneAndDelete({ _id: contactId });
  return contact;
};
