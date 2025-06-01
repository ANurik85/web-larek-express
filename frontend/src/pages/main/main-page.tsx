import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../../components/card/card';
import Gallery from '../../components/gallery/gallery';
import { productsSelector } from '../../services/slice/products';

export default function MainPage() {
	const products = useSelector(productsSelector.selectProducts);
	return (
		<Gallery>
		{products.map(product => (
			<Card key={product._id} dataCard={product} component={Link} />
		))}
	</Gallery>
	)
}
