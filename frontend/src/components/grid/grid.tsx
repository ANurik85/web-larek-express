import { ReactNode } from 'react';
import styles from './grid.module.scss';
type  GridCallbackProps<T> = {
	extraClass: string;
	data: T;
}
type GridProps<T> = {
	data: T[];
	children: (params: GridCallbackProps<T>) => ReactNode
}
export default function Grid<T>({ children, data }:GridProps<T>) {
	return (

		<main className={styles.gallery}>
					{data.map(item => children({extraClass: styles.gallery__item, data: item}))}
			</main>
	)
}
