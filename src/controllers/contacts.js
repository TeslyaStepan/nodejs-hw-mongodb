import {
  deleteContact,
  getAllContacts,
  getContactById,
  patchContact,
  postNewContact,
} from "../services/contacts.js";

export const getAllContactsController = async (req, res, next) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    res.status(404).json({
      message: "Contact not found",
    });
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const postNewContactController = async (req, res, next) => {
  const newContact = await postNewContact(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: {
      contact: {
        ...newContact.toObject(),
        createAt: newContact.createAt,
        updatedAt: newContact.updatedAt,
      },
    },
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await patchContact(contactId, req.body);

  if (!result) {
    res.status(404).json({
      status: 404,
      message: "Contact not found",
    });
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

  const contact = await deleteContact(contactId);

  if (!contact) {
    res.status(404).json({
      message: "Contact not found",
    });
  }

  res.status(204).send();
};
