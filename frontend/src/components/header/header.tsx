import { Link, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/hooks';
import { basketSelector } from '../../services/slice/basket';
import styles from './header.module.scss';
export default function Header() {
	const location = useLocation();
	const {selectBasketTotalCount} = basketSelector;
	const basketItemsCount = useSelector(selectBasketTotalCount);
	return (
		<header className={styles.header}>
			<div className={styles.header__container}>
				<Link className={styles.header__logo} to="/">
					<img className={styles['header__logo-image']} src="/logo.svg" alt="Film! logo" />
				</Link>
				<Link to={{pathname: '/basket'}} state={{background: {...location, pathname: '/', state: null}}}  className={styles.header__basket}>
					<span className={styles['header__basket-counter']}>{basketItemsCount}</span>
				</Link>
			</div>
		</header>
	)
}
