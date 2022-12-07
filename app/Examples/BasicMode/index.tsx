import { useState } from 'react';
import { Email } from '../../../src';
import { Section } from '../../Section';

import './styles.css';

const classes = {
	wrapper: 'basicWrapper',
	dropdown: 'basicDropdown',
	input: 'basicInput',
	suggestion: 'basicSuggestion',
	domain: 'basicDomain'
};

const baseList = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'msn.com', 'proton.me'];

export function BasicMode() {
	const [email, setEmail] = useState('');

	return (
		<Section name="Basic Mode" className="basicSection">
			<label htmlFor="basicMode">Email</label>
			<Email
				id="basicMode"
				placeholder="Enter your email"
				classNames={classes}
				baseList={baseList}
				value={email}
				onChange={setEmail}
			></Email>
		</Section>
	);
}
