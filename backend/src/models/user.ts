import mongoose, { HydratedDocument, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../config';

interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: { token: string }[];
}

interface IUserMethods {
  generateAccessToken(): string;
  generateRefreshToken(): Promise<string>;
  toJSON(): string;
}

interface IUserModel extends Model<IUser, {}, IUserMethods> {
  findUserByCredentials: (
    email: string,
    password: string,
  ) => Promise<HydratedDocument<IUser, IUserMethods>>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Ё-мое',
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    tokens: [{
      token: {
        type: String,
        required: true,
      },
    }],
  },
  {
    versionKey: false,

    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const obj = { ...ret };
        delete obj.password;
        delete obj.tokens;
        delete obj._id;
        return obj;
      },
    },
  },
);

userSchema.pre('save', async function hashingPassword(next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.generateRefreshToken = async function generateRefreshToken() {
  const user = this;
  const refreshToken = jwt.sign(
    { _id: user._id.toString() },
    REFRESH_TOKEN.secret,
    { expiresIn: '7d' },

  );

  const refreshTokenHash = crypto
    .createHmac('sha256', REFRESH_TOKEN.secret)
    .update(refreshToken)
    .digest('hex');

  user.tokens.push({ token: refreshTokenHash });
  await user.save();

  return refreshToken;
};

userSchema.methods.generateAccessToken = function generateAccessToken() {
  const user = this;
  if (typeof ACCESS_TOKEN.expiry !== 'number' && typeof ACCESS_TOKEN.expiry !== 'string') {
    throw new Error('ACCESS_TOKEN.expire должно быть числом или строкой');
  }
  const accessToken = jwt.sign(
    {
      _id: user._id.toString(),
      email: user.email,
    },
    ACCESS_TOKEN.secret,
    { expiresIn: '10m' },

  );

  return accessToken;
};

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email: string,
  password: string,
) {
  const user = await this.findOne({ email }).select('+password').orFail(() => new UnauthorizedError('Неправильные почта или пароль'));
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
  }
  return user;
};

const UserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
export default UserModel;
