import { IOrder, IOrderResult } from '../../../utils/types';
import { createAsyncThunk } from '../../hooks';

export const createOrder = createAsyncThunk<IOrderResult, IOrder>(
  'products/createOrder', (orderData, {extra: {orderProducts}}) => {
    return orderProducts(orderData)
  }
);
