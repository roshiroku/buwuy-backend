import multer from 'multer';
import { extname } from 'path';

export const upload = (path, { allowedTypes }) => {
  // Set storage engine
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path);
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  // File filter to accept only allowed types
  const fileFilter = (req, file, cb) => {
    const ext = allowedTypes?.test(extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes?.test(file.mimetype);

    if (!allowedTypes || (mimetype && ext)) {
      return cb(null, true);
    } else {
      cb(new Error('Disallowed file type'));
    }
  };

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter
  });
};

export const uploadImage = (path, opts = {}) => upload(path, { ...opts, allowedTypes: /jpeg|jpg|png|gif/ });
