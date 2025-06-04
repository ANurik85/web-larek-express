import { Router } from 'express';
import createOrder from '../controllers/order';

const router = Router();

router.post('/order', createOrder);

export default router;
