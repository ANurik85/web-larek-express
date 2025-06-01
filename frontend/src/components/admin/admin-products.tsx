import Button from '@components/button';
import CardAdmin from '@components/card-admin';
import { productsSelector } from '@slices/products';
import { useSelector } from '@store/hooks';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import { AppRoute } from '../../utils/constants';
import styles from './admin.module.scss';
export default function AdminProducts() {
	const location = useLocation();
	const products = useSelector(productsSelector.selectProducts);
	return (
		<main className={clsx(styles.admin__products, styles.admin__container)}>
			<div className={styles.admin__header}>
				<h1 className={styles.admin__title}>Товары</h1>
				<Button
					extraClass={styles.admin__button}
					component={Link}
					to={{ pathname: AppRoute.AddProduct }}
					state={{ background: location }}
					replace
				>
					Добавить товар
				</Button>
			</div>
			{products.map(product => (
				<CardAdmin key={product._id} dataCard={product} component={Link} />
			))}
		</main>
	);
}
