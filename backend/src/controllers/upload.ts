import {
  Request, Response, NextFunction,
} from 'express';
import { constants } from 'http2';
import BadRequestError from '../errors/bad-request-error';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw next(new BadRequestError('Файл не загружен'));
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return next(new BadRequestError('Недопустимый тип файла. Допустимы только: jpeg, png, gif'));
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return next(new BadRequestError('Размер файла превышает допустимый лимит (5MB)'));
    }

    const fileName = `/images/${req.file.filename}`;

    return res.status(constants.HTTP_STATUS_CREATED)
      .send({ fileName, originalName: req.file?.originalname });
  } catch (error) {
    return next(error);
  }
};

export default uploadFile;
