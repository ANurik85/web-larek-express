import { Router } from 'express';
import { validateOrderBody } from '../middlewares/validation';
import createOrder from '../controllers/order';

export const orderRouter = Router();

orderRouter.post('/', validateOrderBody, createOrder);

export default orderRouter;
