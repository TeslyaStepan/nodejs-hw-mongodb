import { Router } from "express";
import {
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  postNewContactController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.get("/", ctrlWrapper(getAllContactsController));

router.get("/:contactId", ctrlWrapper(getContactByIdController));

router.post("/", ctrlWrapper(postNewContactController));

router.patch("/:contactId", ctrlWrapper(patchContactController));

router.delete("/:contactId", ctrlWrapper(deleteContactController));

export default router;
