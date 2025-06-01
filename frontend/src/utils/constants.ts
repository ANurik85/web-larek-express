
import styles from '@components/card/card.module.scss';

export const API_URL = `${import.meta.env.VITE_API_ORIGIN}`;
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}`;

export const CATEGORY_CLASSES = {
	'софт-скил': styles.card__category_soft,
  'хард-скил': styles.card__category_hard,
  'другое': styles.card__category_other,
  'дополнительное': styles.card__category_additional,
  'кнопка': styles.card__category_button,
}

export enum AppRoute {
	Product = '/product/:cardId',
	Basket = '/basket',
	Main = '/',
	NotFound = '/404',
	Order = '/order',
  OrderAddress = '/order/address',
  OrderContacts = '/order/contacts',
	OrderSuccess = '/order/success',
}