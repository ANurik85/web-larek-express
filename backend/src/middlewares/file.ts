import { Request, Express } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { extname, join } from 'path';
import uniqueSlug from 'unique-slug';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: DestinationCallback) => {
    cb(null, join(__dirname, '../public/temp'));
  },

  filename: (_req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    cb(null, `${uniqueSlug(new Date().toUTCString())}${extname(file.originalname)}`);
  },
});

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml'];
const fileSizeLimit = 5 * 1024 * 1024; // 5MB

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: fileSizeLimit,
  },
});
