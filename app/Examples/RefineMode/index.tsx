import { useState } from 'react';
import { Email, domains } from '../../../src';
import { Section } from '../../Section';

import './styles.css';

const classes = {
	wrapper: 'refineWrapper',
	dropdown: 'refineDropdown',
	input: 'refineInput',
	suggestion: 'refineSuggestion',
	domain: 'refineDomain'
};

const baseList = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'msn.com', 'proton.me'];

export function RefineMode() {
	const [email, setEmail] = useState('');

	return (
		<Section name="Refine Mode" className="refineSection">
			<label htmlFor="refineMode">Email</label>

			<Email
				id="refineMode"
				placeholder="Enter your email"
				classNames={classes}
				// maxResults={4}
				baseList={baseList}
				refineList={domains}
				value={email}
				onChange={setEmail}
			/>
		</Section>
	);
}
