import { Router } from 'express';
import {
  login, register, refreshAccessToken, logout, getCurrentUser,
} from '../controllers/auth';

export const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.post('/register', register);
authRoutes.get('/token', refreshAccessToken);
authRoutes.get('/logout', logout);
authRoutes.get('/user', getCurrentUser);

export default authRoutes;
