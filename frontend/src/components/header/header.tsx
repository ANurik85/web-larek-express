import { AppRoute } from '@constants';
import { basketSelector } from '@slices/basket';
import { userActions, userSelectors } from '@slices/user';
import { useActionCreators, useSelector } from '@store/hooks';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import styles from './header.module.scss';
export default function Header() {
	const location = useLocation();
	const {selectBasketTotalCount} = basketSelector;
	const basketItemsCount = useSelector(selectBasketTotalCount);
	const user = useSelector(userSelectors.getUser);
	const { logoutUser, resetUser } = useActionCreators(userActions)
	return (
		<header className={styles.header}>
			<div className={styles.header__container}>
				<Link className={styles.header__logo} to={AppRoute.Main}>
					<img className={styles['header__logo-image']} src="/logo.svg" alt="Film! logo" />
				</Link>
				{!user && <Link to={{pathname: AppRoute.Admin}}  className={clsx(styles.header__icon, styles.header__login) }>
				</Link>}
				{user &&<>
					<Link to={AppRoute.Admin} className={styles.header__user}>Админка</Link>
					<a href='#' onClick={() => logoutUser().unwrap().then(() => resetUser())} className={clsx(styles.header__icon, styles.header__logout)}>Выйти</a>
				</> }
				<Link to={{pathname: AppRoute.Basket}} state={{background: {...location, pathname: AppRoute.Main, state: null}}}  className={clsx(styles.header__icon, styles.header__basket)}>Корзина
					<span className={styles['header__basket-counter']}>{basketItemsCount}</span>
				</Link>

			</div>
		</header>
	)
}
