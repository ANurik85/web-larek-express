import mongoose from 'mongoose';

interface IImage {
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

interface IProduct {
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
  },
});

// создаём модель и экспортируем её
export default mongoose.model<IProduct>('product', productSchema);
