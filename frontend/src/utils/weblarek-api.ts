import { API_URL, CDN_URL } from '@constants';

import { IOrder, IOrderResult, IProduct } from '@types';

export const enum RequestStatus {
	Idle='idle',
	Loading='loading',
	Success='success',
	Failed='failed',
}

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

 type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
 class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse<T>(response: Response): Promise<T> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then(data => Promise.reject(data.error ?? response.statusText));
	}

	get<T>(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse<T>);
	}

	post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse<T>);
	}
}

export interface IWebLarekAPI {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductItem = (id: string): Promise<IProduct> => {
		return this.get<IProduct>(`/product/${id}`).then((data: IProduct) => ({
			...data,
			image: {
				...data.image,
				fileName: this.cdn + data.image.fileName,
			}

		}));
	}

	getProductList = (): Promise<IProduct[]> => {
		return this.get<ApiListResponse<IProduct>>('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map(item => ({
				...item,
				image: {
					...item.image,
					fileName: this.cdn + item.image.fileName,
				}
			}))
		);
	}

	orderProducts = (order: IOrder): Promise<IOrderResult> =>{
		return this.post<IOrderResult>('/order', order).then((data: IOrderResult) => data);
	}
}


export default new WebLarekAPI(CDN_URL, API_URL)