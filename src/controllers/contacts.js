import mongoose from "mongoose";

import createHttpError from "http-errors";
import {
  deleteContact,
  getAllContacts,
  getContactById,
  patchContact,
  postNewContact,
} from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { getEnvVar } from "../utils/getEnvVar.js";

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    userId: req.user._id,
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
  });
  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const postNewContactController = async (req, res, next) => {
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (getEnvVar("ENABLE_CLOUDINARY") === "true") {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const newContact = await postNewContact({
    ...req.body,
    photo: photoUrl,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user?.id;
  const photo = req.file;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, "Invalid contact ID"));
  }

  let photoUrl;

  if (photo) {
    if (getEnvVar("ENABLE_CLOUDINARY") === "true") {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await patchContact(contactId, userId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    return next(createHttpError(404, "Contact not found"));
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: "Successfully patched a contact!",
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(204).send();
};
