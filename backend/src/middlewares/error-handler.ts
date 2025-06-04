import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';

export default function errorHandler(
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (err instanceof BadRequestError) {
    // return res.status(400).json({ message: err.message });
    return next(new BadRequestError(err.message));
  }
  if (err instanceof NotFoundError) {
    // return res.status(404).json({ message: err.message });
    return next(new NotFoundError(err.message));
  }
  if (err instanceof ConflictError) {
    // return res.status(409).json({ message: err.message });
    return next(new ConflictError(err.message));
  }
  if (err instanceof MongooseError.ValidationError) {
    // return res.status(400).json({ message: 'Ошибка валидации данных' });
    return next(new BadRequestError(err.message));
  }
  if (err instanceof Error && err.message.includes('E11000')) {
    // return res.status(409).json({ message: 'Товар с таким названием уже существует' });
    return next(new ConflictError(err.message));
  }
  // return res.status(500).json({ message: 'На сервере произошла ошибка' });
  return next(new Error('На сервере произошла ошибка'));
}
