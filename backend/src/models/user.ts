import mongoose from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: { token: string }[];
}

const userSchema = new mongoose.Schema<IUser>({
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
}, {

});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });
userSchema.path('tokens').select(false);

export default mongoose.model<IUser>('User', userSchema);
