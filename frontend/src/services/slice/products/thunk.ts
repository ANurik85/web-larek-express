import { IProduct } from '../../../utils/types';
import { createAsyncThunk } from '../../hooks';

export const getProducts = createAsyncThunk<IProduct[], void>(
  'products/getProductList', (_, {extra: {getProductList}}) => {
    return getProductList()
  }
);
