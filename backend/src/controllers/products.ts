import { Request, Response } from 'express';
import product from '../models/product';

export const getProduct = (_req: Request, res: Response) => {
  product.find({})
    .then((products) => res.send({
      items: products,
      total: products.length,
    }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const createProduct = (req: Request, res: Response) => {
  const {
    title, image, category, description, price,
  } = req.body;
  return product.create({
    title, image, category, description, price,
  })
    .then((createdproduct) => res.send({ data: createdproduct }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
