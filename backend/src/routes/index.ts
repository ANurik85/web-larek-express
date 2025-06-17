import {
  Request, Response, NextFunction, Router,
} from 'express';
import NotFoundError from '../errors/not-found-error';

import { orderRouter } from './order';
import { productRouter } from './product';
import { authRoutes } from './auth';

const router = Router();
router.use('/order', orderRouter);
router.use('/product', productRouter);
router.use('/auth', authRoutes);

router.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

export default router;
