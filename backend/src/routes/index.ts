import {
  Request, Response, NextFunction, Router,
} from 'express';
import NotFoundError from '../errors/not-found-error';
import { auth } from '../middlewares/auth';

import { orderRouter } from './order';
import { productRouter } from './product';
import { authRoutes } from './auth';
import { uploadRouter } from './upload';

const router = Router();

router.use('/order', orderRouter);
router.use('/product', productRouter);
router.use('/auth', authRoutes);
router.use('/upload', auth, uploadRouter);

router.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

export default router;
