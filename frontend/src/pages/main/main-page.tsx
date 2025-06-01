import Card from '@components/card';
import Grid from '@components/grid/grid';
import { productsSelector } from '@slices/products';
import { IProduct } from '@types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function MainPage() {
	const products = useSelector(productsSelector.selectProducts);
	return (
		<Grid<IProduct> data={products}>
			{({ extraClass, data }) => <Card extraClass={extraClass} key={data._id} dataCard={data} component={Link} />}
		</Grid>
	);
}
