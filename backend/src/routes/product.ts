import { Router } from 'express';
import { getProduct, createProduct /* deleteProduct, updateProduct */ } from '../controllers/products';
// import auth from './auth';
import {
  validateProductBody,
  validateProductUpdateBody,
  validateObjId,
} from '../middlewares/validation';

export const productRouter = Router();

productRouter.get('/product', getProduct);
productRouter.post('/product', /* auth, */ validateProductBody, createProduct);
productRouter.delete('/product/:productId', /* auth, */ validateObjId /* deleteProduct */);
productRouter.patch('/product/:productId', /* auth, */ validateObjId, validateProductUpdateBody /* updateProduct */);

export default productRouter;
