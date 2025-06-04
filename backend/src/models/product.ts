import mongoose from 'mongoose';

interface IImage {
  fileName: string,
  originalName: string;
}

const imageSchema = new mongoose.Schema<IImage>({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
});

interface IProduct {
  title: string;
  image: IImage;
  category: string;
  description: string;
  price: number;
}

// опишем схему:
const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    unique: true,
  },
  image: imageSchema,
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
});

// создаём модель и экспортируем её
export default mongoose.model<IProduct>('product', productSchema);
