import {
	BrowserRouter,
	Route,
	Routes,
	To,
	useLocation,
	useNavigate
} from 'react-router-dom';
import '../../index.scss';
import styles from './app.module.scss';

import Basket from '@components/basket';
import CardDetails from '@components/card-details';
import Header from '@components/header';
import Modal from '@components/modal';
import { AppRoute } from '@constants';
import {
	productsActions
} from '@slices/products';
import { useActionCreators } from '@store/hooks';
import store, { persistor } from '@store/store';
import { PropsWithChildren, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import MainPage from '../../pages/main/main-page';
import Order, { OrderAddress, OrderContacts, OrderSuccess } from '../order';

const App = () => (
	<BrowserRouter>
		<ProviderComponent>
			<div className={styles.app}>
				<RouteComponent />
			</div>
		</ProviderComponent>
	</BrowserRouter>
);

export default App;

const RouteComponent = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { getProducts } = useActionCreators(productsActions);
	const handleModalClose = (path: To | number)  => () => navigate(path as To);

	useEffect(() => {
		getProducts();
	}, [getProducts]);

	const locationState = location.state as { background?: Location };
	const background = locationState && locationState.background;

	return (
		<>
			<Header />
			<Routes location={background || location}>
				<Route
					path={AppRoute.Main}
					element={<MainPage />}
				/>
				<Route path={AppRoute.Basket} element={<Basket />} />
				<Route path={AppRoute.Order} element={<Order />}>
					<Route path={AppRoute.OrderAddress} element={<OrderAddress />} />
					<Route path={AppRoute.OrderAddress} element={<OrderContacts />} />
					<Route path={AppRoute.OrderAddress} element={<OrderSuccess />} />
				</Route>
				<Route path={AppRoute.Product} element={<CardDetails />} />
			</Routes>
			{background && (
				<Routes>
					<Route
						path={AppRoute.Product}
						element={
							<Modal onClose={handleModalClose(-1)}>
								<CardDetails />
							</Modal>
						}
					/>
					<Route path={AppRoute.Basket} element={<Modal onClose={handleModalClose(-1)}><Basket /></Modal>} />
					<Route path={AppRoute.Order} element={<Order />}>
						<Route path={AppRoute.OrderAddress} element={<Modal title='Способ оплаты' onClose={handleModalClose({pathname: AppRoute.Main})}><OrderAddress /></Modal>} />
						<Route path={AppRoute.OrderContacts} element={<Modal onClose={handleModalClose({pathname: AppRoute.Main})}><OrderContacts /></Modal>} />
						<Route path={AppRoute.OrderSuccess} element={<Modal onClose={handleModalClose({pathname: AppRoute.Main})}><OrderSuccess /></Modal>} />
					</Route>
				</Routes>
			)}
		</>
	);
};

const ProviderComponent = ({ children }: PropsWithChildren) => (
	<Provider store={store}>
		{' '}
		<PersistGate persistor={persistor}>{children}</PersistGate>
	</Provider>
);
