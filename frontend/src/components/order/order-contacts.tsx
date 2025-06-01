import InputMask from "@mona-health/react-input-mask";
import { SyntheticEvent, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppRoute } from '../../utils/constants';
import Button from '../button/button';
import { Input } from '../form';
import Form from '../form/form';
import useFormWithValidation from '../form/hooks/useFormWithValidation';
import { ContactsFormValues } from './helpers/types';

import { useActionCreators, useSelector } from '../../services/hooks';
import { basketActions } from '../../services/slice/basket';
import { orderActions, orderSelector } from '../../services/slice/order';
import styles from './order.module.scss';

export function OrderContacts() {
	const location = useLocation();
	const navigate = useNavigate();
	const { selectOrderInfo } = orderSelector;
	const orderPersistData = useSelector(selectOrderInfo);
	const formRef = useRef<HTMLFormElement | null>(null);
	const { resetBasket } = useActionCreators(basketActions);
	const { setInfo, createOrder } = useActionCreators(orderActions);
	const {
		values,
		handleChange,
		errors,
		setValuesForm,
		isValid
	} = useFormWithValidation<ContactsFormValues>({ email: "", phone: "" }, formRef.current);

	useEffect(() => {
		// восстанавливаем значение формы из стора
		setValuesForm({
			email: orderPersistData.email,
			phone: orderPersistData.phone
		});
	}, [orderPersistData]);


	const handleFormSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setInfo(values);
		// т.к. на момент отправки запроса данные введенные в поля еще не записаны в store, добавляем в запрос их вручную
		createOrder({ ...orderPersistData, ...values }).unwrap().then(
			(dataResponse) => {
				resetBasket();
				navigate({ pathname: AppRoute.OrderSuccess }, { state: { orderResponse: dataResponse, background: { ...location, pathname: '/', state: null } }, replace: true });
			});
	};

	return (
		<Form handleFormSubmit={handleFormSubmit} formRef={formRef}>
			<Input value={values.email || ""} onChange={handleChange} name='email' type="email" placeholder="Введите Email" label='Email' required error={errors.email} />
			<Input value={values.phone || ""} onChange={handleChange} name='phone' type="tel" placeholder="+7 (999) 999-99-99" mask="+7 (999) 999 99 99" label='Телефон' required error={errors.phone} component={InputMask} />

			<div className={styles.order__buttons}>
				<Button type="button" extraClass={styles.order__button_secondary} component={Link} to={{ pathname: AppRoute.OrderAddress }} state={{ background: { ...location, pathname: '/', state: null } }} replace >Назад</Button>
				<Button type="submit" disabled={!isValid}>Оплатить</Button>
			</div>
		</Form>
	);
}
