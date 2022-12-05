import { useState } from 'react';
import { Email } from '../../../src';

import './styles.css';

const classes = {
	wrapper: 'basicWrapper',
	dropdown: 'basicDropdown',
	input: 'basicInput',
	suggestion: 'basicSuggestion',
	domain: 'basicDomain'
};

const baseList = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];

export function BasicMode() {
	const [email, setEmail] = useState('');

	return (
		<>
			<label htmlFor="basicChildren">Email</label>
			<Email
				id="basicChildren"
				placeholder="Enter your email"
				classNames={classes}
				baseList={baseList}
				value={email}
				onChange={setEmail}
			></Email>
		</>
	);
}
