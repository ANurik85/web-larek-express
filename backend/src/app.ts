/* eslint-disable no-console */
import path from 'path';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import errorHandler from './middlewares/error-handler';
import NotFoundError from './errors/not-found-error';

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/weblarek');

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(productRouter);
app.use(orderRouter);

app.use((_req, _res, next) => next(new NotFoundError('Маршрут не найден')));

app.use(errorHandler);

app.listen(3000, () => { console.log('Server is running on http://localhost:3000'); });
