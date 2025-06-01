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
    fileName: string
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


export interface IUser {
	email: string;
	name: string;
}

export type ServerResponse<T> = {
	success: boolean;
} & T;

export type UserResponseToken = ServerResponse<{
	user: IUser;
	accessToken: string;
	refreshToken: string;
}>;

export type UserResponse = ServerResponse<{
	user: IUser;
}>;

export type RefreshResponse = ServerResponse<{
	accessToken: string;
	refreshToken: string;
}>;

export type UserLoginBodyDto = {
	email: string;
	password: string;
};

export type UserRegisterBodyDto = {
	password: string;
} & IUser;

export type OrderForm = Omit<IOrder, 'total'|'items'>;

export interface IOrderResult {
    id: string;
    total: number;
}