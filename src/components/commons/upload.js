import multer from "multer";
import path from "path";

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg||JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    return cb(
      new Error(`Do not support ${path.extname(file.originalname)}`),
      false
    );
  }
  cb(null, true);
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fieldname = file.fieldname;
    // console.log(fieldname);
    let stringPath = "";
    if (fieldname === "products") {
      stringPath = "product";
    }
    if (fieldname === "avatar") {
      stringPath = "avatar";
    }
    const __dirname = path.resolve();
    cb(null, path.join(`${__dirname}/uploads/${stringPath}`));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage, fileFilter });
export default upload;
