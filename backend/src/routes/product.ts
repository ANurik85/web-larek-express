import { Router } from 'express';
import { createProduct, getProduct } from '../controllers/products';

const router = Router();

router.get('/product', getProduct);
router.post('/product', createProduct);

export default router;
