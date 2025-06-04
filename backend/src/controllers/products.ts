import { Request, Response, NextFunction } from 'express';
import product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getProduct = (_req: Request, res: Response, next: NextFunction) => {
  product.find({})
    .then((products) => res.send({
      items: products,
      total: products.length,
    }))
    .catch((error) => next(error));
};

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    title, image, category, description, price,
  } = req.body;
  return product.create({
    title, image, category, description, price,
  })
    .then((createdproduct) => res.send({ data: createdproduct }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка валидации данных при создании товара'));
      }
      if (error.message.includes('E11000')) {
        return next(new ConflictError('Товар с таким названием уже существует'));
      }
      return next(error);
    });
};
