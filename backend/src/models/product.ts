import mongoose, { Document, Model } from 'mongoose';
import { unlink } from 'fs/promises';
import { join } from 'path';

interface IImage extends Document {
  fileName: string,
  originalName: string;
}

const imageSchema = new mongoose.Schema<IImage>({
  fileName: {
    type: String,
    required: [true, 'Поле "image" должно быть заполнено'],
  },
  originalName: {
    type: String,
    required: [true, 'Поле "originalName" должно быть заполнено'],
  },
});

interface IProduct extends Document {
  title: string;
  image: IImage;
  category: string;
  description: string;
  price: number;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Поле "title" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
    unique: true,
  },
  image: imageSchema,
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле "description" должно быть заполнено'],
  },
  price: {
    type: Number,
    required: [true, 'Поле "price" должно быть заполнено'],
    default: null,
  },
});

productSchema.post<IProduct>('deleteOne', { document: true, query: false }, async (doc, next) => {
  try {
    if (doc.image) {
      const imagePath = join(__dirname, '../public', doc.image.fileName);
      try {
        await unlink(imagePath);
      } catch (err) {
        if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 'ENOENT') {
          return next();
        }
      }
    }
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product;
