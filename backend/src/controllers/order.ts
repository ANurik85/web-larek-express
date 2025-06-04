import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import product from '../models/product';

export default async function createOrder(req: Request, res: Response) {
  try {
    const {
      payment, email, phone, address, total, items,
    } = req.body;

    // Валидация полей
    if (!['card', 'online'].includes(payment)) {
      return res.status(400).json({ message: 'Некорректный способ оплаты' });
    }
    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ message: 'Некорректный email' });
    }
    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ message: 'Некорректный телефон' });
    }
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ message: 'Некорректный адрес' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Массив товаров обязателен' });
    }

    // Проверка товаров
    const products = await product.find({ _id: { $in: items } });
    if (products.length !== items.length) {
      return res.status(400).json({ message: 'Один или несколько товаров не найдены' });
    }
    if (products.some((p) => p.price == null)) {
      return res.status(400).json({ message: 'В заказе есть непродаваемый товар' });
    }

    // Проверка суммы
    const sum = products.reduce((acc, p) => acc + (p.price ?? 0), 0);
    if (sum !== total) {
      return res.status(400).json({ message: 'Сумма заказа не совпадает' });
    }
    // Генерация id заказа
    const id = faker.string.uuid();

    return res.status(201).json({ id, total: sum });
  } catch (e) {
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
}
