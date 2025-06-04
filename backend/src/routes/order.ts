import { Router } from 'express';
import createOrder from '../controllers/order';

const orderRouter = Router();

orderRouter.post('/order', createOrder);

export default orderRouter;
