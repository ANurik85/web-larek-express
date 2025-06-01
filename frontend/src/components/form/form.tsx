import clsx from 'clsx';
import { ReactNode, SyntheticEvent } from 'react';
import styles from './form.module.scss';


type FormProps = {
	handleFormSubmit?: (e:SyntheticEvent<HTMLFormElement>) => void,
	children: ReactNode,
	extraClass?: string;
	formRef?:  React.RefObject<HTMLFormElement>;
}

export default function Form({handleFormSubmit, children, formRef, extraClass, ...props}: FormProps) {
	return (
		<form ref={formRef}  className={clsx(styles.form, { [extraClass as string]: !!extraClass })} onSubmit={handleFormSubmit} {...props}>
			{children}
		</form>
	)
}
