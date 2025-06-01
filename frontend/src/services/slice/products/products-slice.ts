import { RequestStatus } from '@api';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IProduct } from '../../../utils/types';
import { getProducts } from './thunk';
import { TProductState } from './type';

const initialState: TProductState = {
  data: [],
  status: RequestStatus.Idle,
};


export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getProducts.fulfilled, (state, { payload }:PayloadAction<IProduct[]>) => {
        state.data = payload;
        state.status = RequestStatus.Success;
      })
      .addCase(getProducts.rejected, (state) => {
        state.status = RequestStatus.Failed;
      });
  },
  selectors: {
    selectProducts: (state:TProductState) => state.data,
  }
});
