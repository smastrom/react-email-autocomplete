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
		<Section name="Refine Mode" folderName="RefineMode" className="refineSection">
			<label htmlFor="refineMode">Email</label>
			{/* <div style={{ height: 600, overflow: 'auto', width: '100%' }}> */}
			<div /* style={{ height: 1200, display: 'flex', alignItems: 'center' }} */>
				<Email
					id="refineMode"
					placeholder="Enter your email"
					classNames={classes}
					baseList={baseList}
					refineList={domains}
					value={email}
					onChange={setEmail}
				/>
			</div>
			{/* </div> */}
		</Section>
	);
}
