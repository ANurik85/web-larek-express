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

// interface IOrder {
//   payment: string;
//   email: string;
//   phone: string;
//   address: string;
//   total: number;
//   items: string[];
// }

// const orderSchema = new mongoose.Schema<IOrder>({
//   payment: {
//     type: String,
//     enum: ['card', 'online'],
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   total: {
//     type: Number,
//     required: true,
//   },
//   items: [{
//     type: String,
//   }],

// });

// export mongoose.model<IOrder>('order', orderSchema);
// создаём модель и экспортируем её
export default mongoose.model<IProduct>('product', productSchema);
