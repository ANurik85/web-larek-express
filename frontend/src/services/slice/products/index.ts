import { productsSlice } from './products-slice';
import { getProducts } from './thunk';



export const productsActions = { ...productsSlice.actions, getProducts };
export const productsSelector = productsSlice.selectors;


export type { TProductState } from './type';
