/* eslint-disable no-console */
import path from 'path';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { productRouter, orderRouter } from './routes';
import errorHandler from './middlewares/error-handler';
import NotFoundError from './errors/not-found-error';
import { authRoutes } from './routes/auth';

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/weblarek');

app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger); // логгер запросов до роутов

app.use(productRouter);
app.use(orderRouter);
app.use('/auth', authRoutes);

app.use((_req, _res, next) => next(new NotFoundError('Маршрут не найден')));
app.use(errorLogger); // логгер ошибок после роутов
app.use(errorHandler);

app.listen(3000, () => { console.log('Server is running on http://localhost:3000'); });
