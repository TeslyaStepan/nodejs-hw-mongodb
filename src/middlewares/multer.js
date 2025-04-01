import multer from "multer";
import { TEMP_UPLOAD_DIR } from "../constants/index.js";

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cd) {
    const uniquePrefix = Date.now();
    cd(null, `${uniquePrefix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
