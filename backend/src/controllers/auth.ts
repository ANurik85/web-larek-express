import {
  Request, Response, NextFunction, CookieOptions,
} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import User from '../models/user';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { _id: userId },
    process.env.AUTH_ACCESS_TOKEN_SECRET || 'access-secret',
    { expiresIn: '10m' },
  );

  const refreshToken = jwt.sign(
    { _id: userId },
    process.env.AUTH_REFRESH_TOKEN_SECRET || 'refresh-secret',
    { expiresIn: '7d' },
  );

  return { accessToken, refreshToken };
};

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  maxAge: ms('7d'),
  path: '/',
};

// export const login = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select('+password');
//     if (!user) {
//       return next(new UnauthorizedError('Неправильные почта или пароль'));
//     }

//     const isPasswordMatch = await user.comparePassword(password);
//     if (!isPasswordMatch) {
//       return next(new UnauthorizedError('Неправильные почта или пароль'));
//     }

//     const { accessToken, refreshToken } = generateTokens(user._id.toString());
//     const newToken = { token: refreshToken };
//     user.tokens.push(newToken);
//     await user.save();

//     res.cookie('refreshToken', refreshToken, cookieOptions);

//     return res.status(200).json({
//       success: true,
//       user: {
//         email: user.email,
//         name: user.name,
//       },
//       accessToken,
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        const newToken = { token: refreshToken };
        user.tokens.push(newToken);
        return user.save()
          .then(() => {
            res.cookie('refreshToken', refreshToken, cookieOptions);
            return res.status(200).json({
              success: true,
              user: {
                email: user.email,
                name: user.name,
              },
              accessToken,
            });
          });
      });
    })
    .catch(next);
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }

    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    const newToken = { token: refreshToken };
    user.tokens.push(newToken);
    await user.save();

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return res.status(201).json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
      },
      accessToken,
    });
  } catch (error) {
    const errorAsError = error as Error;
    if (errorAsError.name === 'ValidationError') {
      return next(new BadRequestError('Ошибка валидации данных при создании пользователя'));
    }
    return next(error);
  }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new UnauthorizedError('Токен не предоставлен'));
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.AUTH_REFRESH_TOKEN_SECRET || 'refresh-secret',
    ) as { _id: string };

    const user = await User.findById(payload._id);
    if (!user || !user.tokens.find((token) => token.token === refreshToken)) {
      return next(new UnauthorizedError('Недействительный токен'));
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString());
    const newToken = { token: refreshToken };
    user.tokens.push(newToken);
    await user.save();

    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
      },
      accessToken,
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Токен истек'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Недействительный токен'));
    }
    return next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new BadRequestError('Токен не предоставлен'));
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.AUTH_REFRESH_TOKEN_SECRET || 'refresh-secret',
    ) as { _id: string };

    const user = await User.findById(payload._id);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    user.tokens = user.tokens.filter((token) => token.token !== refreshToken);
    await user.save();

    res.clearCookie('refreshToken', {
      ...cookieOptions,
      maxAge: 0,
      expires: new Date(0),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new BadRequestError('Недействительный токен'));
    }
    return next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Токен не предоставлен'));
    }

    const accessToken = authHeader.split(' ')[1];
    const payload = jwt.verify(
      accessToken,
      process.env.AUTH_ACCESS_TOKEN_SECRET || 'access-secret',
    ) as { _id: string };

    const user = await User.findById(payload._id);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Токен истек'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Недействительный токен'));
    }
    return next(error);
  }
};
