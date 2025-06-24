import { Router } from 'express';
import { auth } from '../middlewares/auth';
import {
  login, register, refreshAccessToken, logout, getCurrentUser,
} from '../controllers/auth';

export const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.post('/register', register);
authRoutes.get('/token', auth, refreshAccessToken);
authRoutes.get('/logout', auth, logout);
authRoutes.get('/user', auth, getCurrentUser);

export default authRoutes;
