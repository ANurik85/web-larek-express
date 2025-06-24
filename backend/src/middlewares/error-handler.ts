import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';

export default function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let status = 500;
  let message = 'На сервере произошла ошибка';

  if (err instanceof BadRequestError) {
    status = 400;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    status = 404;
    message = err.message;
  } else if (err instanceof ConflictError) {
    status = 409;
    message = err.message;
  } else if (err instanceof MongooseError.ValidationError) {
    status = 400;
    message = err.message;
  } else if (err.message.includes('E11000')) {
    status = 409;
    message = 'Конфликт - дублирующаяся запись';
  }

  return res.status(status).json({
    message,
    status,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
