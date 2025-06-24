import { Router } from 'express';
import {
  getProduct, createProduct, deleteProduct, updateProduct,
} from '../controllers/products';
import { auth } from '../middlewares/auth';
import {
  validateProductBody,
  validateProductUpdateBody,
  validateObjId,
} from '../middlewares/validation';

export const productRouter = Router();

productRouter.get('/', getProduct);
productRouter.post('/', auth, validateProductBody, createProduct);
productRouter.delete('/:productId', auth, validateObjId, deleteProduct);
productRouter.patch('/:productId', auth, validateObjId, validateProductUpdateBody, updateProduct);

export default productRouter;
