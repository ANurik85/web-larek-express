import { Router } from 'express';
import createOrder from '../controllers/order';

export const orderRouter = Router();

orderRouter.post('/', createOrder);

export default orderRouter;
