import {
  Request, Response, NextFunction,
} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';
import { ACCESS_TOKEN } from '../config';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  let payload: JwtPayload | null = null;
  if (req.originalUrl === '/auth/token') {
    return next();
  }
  if (req.originalUrl === '/auth/logout') {
    return next();
  }
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Токен не предоставлен');
    }
    const accessTokenParts = authHeader.split(' ');
    const aTkn = accessTokenParts[1];

    payload = jwt.verify(
      aTkn,
      ACCESS_TOKEN.secret,
    ) as JwtPayload;
    res.locals.user = payload;
    return next();
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Истек срок действия токена'));
    }
    return next(new UnauthorizedError('Необходимо авторизоваться'));
  }
};

export default auth;
