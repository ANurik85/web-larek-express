import path from 'path';
import express, { json } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import routes from './routes';
import errorHandler from './middlewares/error-handler';
import { startCleanupSchedule } from './utils/cleanupTempFiles';

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/weblarek');

startCleanupSchedule();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);
app.use(json());
app.use(cookieParser());
app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

// eslint-disable-next-line no-console
app.listen(3000, () => { console.log('Server is running on http://localhost:3000'); });
