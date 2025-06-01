import { CATEGORY_CLASSES } from '@constants';
import { PaymentType } from '../../components/order/helpers/types';

export interface IProduct {
    _id: string;
    title: string;
    price: number | null;
    description: string;
    category: keyof typeof CATEGORY_CLASSES;
    image: IFile;
}

export interface IFile {
    fileName: string;
    originalName: string;
}

export interface IBasket {
    items: IProduct[];
    totalCount: number;
}

export interface IOrder {
    payment: PaymentType;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export type OrderForm = Omit<IOrder, 'total'|'items'>;

export interface IOrderResult {
    id: string;
    total: number;
}