import { orderSlice } from './order-slice';
import { createOrder } from './thunk';



export const orderActions = { ...orderSlice.actions, createOrder };
export const orderSelector = orderSlice.selectors;


export type { TOrderState } from './type';
