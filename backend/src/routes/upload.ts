import { Router } from 'express';
import fileMiddleware from '../middlewares/file';
import { uploadFile } from '../controllers/upload';

export const uploadRouter = Router();

uploadRouter.post('/', fileMiddleware.single('file'), uploadFile);

export default uploadRouter;
