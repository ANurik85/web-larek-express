export interface PaymentFormValues {
	address: string;
	payment: PaymentType;
}

export interface ContactsFormValues {
	email: string;
	phone: string;
}

export enum PaymentType {
  Card = 'card',
  Online = 'online',
}