import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { join } from 'path';
import NotFoundError from '../errors/not-found-error';
import product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import movingFile from '../utils/movingFile';

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
      title, image, category, description, price,
    } = req.body;

    if (image) {
      movingFile(image.fileName, join(__dirname, `../public/${process.env.UPLOAD_PATH_TEMP}`), join(__dirname, `../public/${process.env.UPLOAD_PATH}`));
    }

    const newproduct = await product.create({
      title, image, category, description, price,
    });
    return res.send(newproduct);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Ошибка валидации данных при создании товара'));
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }
    return next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      title, image, category, description, price,
    } = req.body;

    if (image) {
      movingFile(image.fileName, join(__dirname, `../public/${process.env.UPLOAD_PATH_TEMP}`), join(__dirname, `../public/${process.env.UPLOAD_PATH}`));
    }

    const updatedProduct = await product.findByIdAndUpdate(id, {
      title, image, category, description, price,
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
    const { id } = req.params;
    const deletedProduct = await product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new NotFoundError('Товар не найден'));
    }

    return res.send(deletedProduct);
  } catch (error) {
    return next(error);
  }
};
