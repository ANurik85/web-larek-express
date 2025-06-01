import { combineReducers } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';
import basketSlice from './slice/basket';
import { orderSlice } from './slice/order/order-slice';
import { productsSlice } from './slice/products/products-slice';
import { userSlice } from './slice/user/user-slice';

const persistConfigBasket = {
	key: 'basket',
	storage: storage,
}
const persistConfigOrder = {
	key: 'order',
	storage: storage,
}
const persistedBasketReducer = persistReducer(persistConfigBasket, basketSlice.reducer);
const persistedOrderReducer = persistReducer(persistConfigOrder, orderSlice.reducer);

export const rootReducer = combineReducers({
  [basketSlice.name]: persistedBasketReducer,
	[productsSlice.name]: productsSlice.reducer,
	[orderSlice.name]: persistedOrderReducer,
	[userSlice.name]: userSlice.reducer
});
