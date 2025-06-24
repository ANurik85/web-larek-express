import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { join } from 'path';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import movingFile from '../utils/movingFile';
import product from '../models/product';

export const getProduct = (_req: Request, res: Response, next: NextFunction) => {
  product.find({})
    .then((products) => res.send({
      items: products,
      total: products.length,
    }))
    .catch((error) => next(error));
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      description, image, category, title, price,
    } = req.body;

    if (!title || !category || !description) {
      throw new BadRequestError('Необходимо заполнить все обязательные поля');
    }

    if (!price) {
      throw new BadRequestError('Необходимо указать цену товара');
    }

    const existingProduct = await product.findOne({ title });
    if (existingProduct) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }

    if (image) {
      movingFile(image.fileName, join(__dirname, '../public/temp'), join(__dirname, '../public/images'));
    }

    const newProduct = await product.create({
      description,
      image,
      category,
      title,
      price,
    });

    return res.status(201).send(newProduct);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Ошибка валидации данных при создании товара'));
    }
    return next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new BadRequestError('Неверный формат ID товара'));
    }

    const {
      description,
      image,
      category,
      title,
      price,
    } = req.body;

    const imageToUpdate = image ? {
      fileName: image.fileName,
      originalName: image.originalName || image.fileName,
    } : undefined;

    if (imageToUpdate) {
      movingFile(imageToUpdate.fileName, join(__dirname, '../public/temp'), join(__dirname, '../public/images'));
    }

    if (title) {
      const existingProduct = await product.findOne({ title });
      if (existingProduct && existingProduct.id.toString() !== productId) {
        return next(new ConflictError('Товар с таким названием уже существует'));
      }
    }

    const updatedProduct = await product.findByIdAndUpdate(productId, {
      description,
      image: imageToUpdate,
      category,
      title,
      price,
    }, { new: true });

    if (!updatedProduct) {
      return next(new NotFoundError('Товар не найден'));
    }

    return res.send(updatedProduct);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Ошибка валидации данных при обновлении товара'));
    }
    return next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new BadRequestError('Неверный формат ID товара'));
    }

    const deletedProduct = await product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return next(new NotFoundError('Товар не найден'));
    }

    return res.send(deletedProduct);
  } catch (error) {
    return next(error);
  }
};
