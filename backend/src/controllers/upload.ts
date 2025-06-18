import {
  Request, Response, NextFunction,
} from 'express';
import { constants } from 'http2';
import BadRequestError from '../errors/bad-request-error';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw next(new BadRequestError('Файл не выбран'));
    }
    const filename = process.env.UPLOAD_PATH ? `/${process.env.UPLOAD_PATH}/${req.file.filename}` : `/${req.file?.filename}`;
    return res.status(constants.HTTP_STATUS_CREATED)
      .send({ filename, originalName: req.file?.originalname });
  } catch (error) {
    return next(error);
  }
};

export default uploadFile;
