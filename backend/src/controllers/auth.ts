import {
  Request, Response, NextFunction,
} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import User from '../models/user';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';
import { REFRESH_TOKEN } from '../config';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new BadRequestError('Необходимо указать email и пароль'));
    }
    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      return next(new UnauthorizedError('Неверные данные для входа'));
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    res.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options);
    return res.json({
      success: true,
      user,
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new BadRequestError('Необходимо заполнить все обязательные поля'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }

    const newUser = new User({ email, password, name });
    await newUser.save();

    const accessToken = await newUser.generateAccessToken();
    const refreshToken = await newUser.generateRefreshToken();

    res.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options);

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      user: newUser,
      accessToken,
    });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Некорректные данные'));
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(error);
  }
};

const getCurrentUser = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user._id;
    const user = await User.findById(userId)
      .orFail(() => new NotFoundError('Пользователь не найден'));
    res.json({
      user,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRefreshTokenInUser = async (req: Request, _res: Response, _next: NextFunction) => {
  const { cookies } = req;
  const rfTkn = cookies[REFRESH_TOKEN.cookie.name];
  if (!rfTkn) {
    throw new UnauthorizedError('Неверный токен');
  }
  const decodedRefreshToken = jwt.verify(
    rfTkn,
    REFRESH_TOKEN.secret,
  ) as JwtPayload;
  const user = await User.findOne({ _id: decodedRefreshToken._id }).orFail(() => new UnauthorizedError('Пользователь не найден'));

  const rTkHash = crypto
    .createHmac('sha256', REFRESH_TOKEN.secret)
    .update(rfTkn)
    .digest('hex');

  const filterTokens = user.tokens.filter((tokenObj) => tokenObj.token !== rTkHash);
  user.tokens = filterTokens;
  await user.save();
  return user;
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteRefreshTokenInUser(req, res, next);
    const expireCookieOptions = { ...REFRESH_TOKEN.cookie.options, maxAge: -1 };
    res.cookie(REFRESH_TOKEN.cookie.name, '', expireCookieOptions);
    res.cookie('accessToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userWithRefreshTkn = await deleteRefreshTokenInUser(req, res, next);
    const accessToken = await userWithRefreshTkn.generateAccessToken();
    const refreshToken = await userWithRefreshTkn.generateRefreshToken();

    res.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options);

    return res.json({
      success: true,
      user: userWithRefreshTkn,
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

export {
  login,
  register,
  getCurrentUser,
  logout,
  refreshAccessToken,
};
