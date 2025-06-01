import { API_URL, CDN_URL } from '@constants';

import { IFile, IOrder, IOrderResult, IProduct, ServerResponse, UserLoginBodyDto, UserRegisterBodyDto, UserResponse, UserResponseToken } from '@types';
import { getCookie, setCookie } from './cookie';

export const enum RequestStatus {
	Idle = 'idle',
	Loading = 'loading',
	Success = 'success',
	Failed = 'failed',
}


export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

class Api {
	private readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				...((options.headers as object) ?? {}),

			},
		};
	}

	protected handleResponse<T>(response: Response): Promise<T> {
		return response.ok
			? response.json()
			: response
				.json()
				.then(err => Promise.reject({ ...err, statusCode: response.status }));
	}

	protected async request<T>(endpoint: string, options: RequestInit) {
		try {
			const res = await fetch(`${this.baseUrl}${endpoint}`, {
				...this.options,
				...options,
			});
			return await this.handleResponse<T>(res);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	private refreshToken = () => {
		return this.request<UserResponseToken>('/auth/token', {
			method: 'GET',
			credentials: 'include'
		});
	};


	protected requestWithRefresh = async <T>(
		endpoint: string,
		options: RequestInit
	) => {
		try {
			return await this.request<T>(endpoint, options);
		} catch (error) {
				const refreshData = await this.refreshToken();
				if (!refreshData.success) {
					return Promise.reject(refreshData);
				}
				setCookie('accessToken', refreshData.accessToken);
				return await this.request<T>(endpoint, {
					...options,
					headers: {
						...options.headers,
						Authorization: `Bearer ${getCookie('accessToken')}`
					},
				});
			}
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
		return this.request<IProduct>(`/product/${id}`, { method: 'GET' }).then((data: IProduct) => ({
			...data,
			image: {
				...data.image,
				fileName: this.cdn + data.image.fileName,
			}
		}));
	};

	getProductList = (): Promise<IProduct[]> => {
		return this.request<ApiListResponse<IProduct>>('/product', { method: 'GET' }).then((data: ApiListResponse<IProduct>) =>
			data.items.map(item => ({
				...item,
				image: {
					...item.image,
					fileName: this.cdn + item.image.fileName,
				}
			}))
		);
	};

	orderProducts = (order: IOrder): Promise<IOrderResult> => {
		return this.request<IOrderResult>('/order', {
			method: 'POST',
			body: JSON.stringify(order),
			headers: {
				'Content-Type': 'application/json',
			}
		}).then((data: IOrderResult) => data);
	};

	loginUser = (data: UserLoginBodyDto) => {
		return this.request<UserResponseToken>('/auth/login', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include'
		});
	};

	registerUser = (data: UserRegisterBodyDto) => {
		return this.request<UserResponseToken>('/auth/register', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include'
		});
	};

	getUser = () => {
		return this.requestWithRefresh<UserResponse>('/auth/user', {
			method: 'GET',
			headers: { Authorization: `Bearer ${getCookie('accessToken')}` }
		});
	};

	logoutUser = () => {
		return this.request<ServerResponse<unknown>>('/auth/logout', { method: 'GET', credentials: 'include' });
	};

	createProduct = (data: Omit<IProduct, '_id'>)  =>  {
		console.log(data);
		return this.requestWithRefresh<IProduct>('/product', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getCookie('accessToken')}`
			}
		}).then((data: IProduct) => ({
			...data,
			image: {
				...data.image,
				fileName: this.cdn + data.image.fileName,
			}
		}));
	};

	uploadFile = (data: FormData) => {
		return this.requestWithRefresh<IFile>('/upload', {
			method: 'POST',
			body: data,
			headers: {
				Authorization: `Bearer ${getCookie('accessToken')}`
			}
		}).then((data) => ({
			...data,
			fileName: data.fileName,
		}));
	};

	updateProduct = (data: Partial<Omit<IProduct, '_id'>>, id: string) => {
		return this.requestWithRefresh<IProduct>(`/product/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getCookie('accessToken')}`
			}
		}).then((data: IProduct) => ({
			...data,
			image: {
				...data.image,
				fileName: this.cdn + data.image.fileName,
			}
		}));
	};

	deleteProduct = (id: string) => {
		return this.requestWithRefresh<IProduct>(`/product/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${getCookie('accessToken')}`
			}
		});
	};
}


export default new WebLarekAPI(CDN_URL, API_URL);