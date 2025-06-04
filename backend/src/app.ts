import path from 'path';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import productRouter from './routes/product';

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/weblarek');

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(productRouter);

app.listen(3000, () => { console.log('Server is running on http://localhost:3000'); });
