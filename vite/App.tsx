import React, { useRef, useState } from 'react';
import { Email } from '../src/Email';
import domainList from '../src/domains.json';

import '../src/base.css';
import '../src/input.css';

export const baseList = ['google.com', 'email.com', 'proton.me', 'yahoo.com'];

function App() {
	const extRef = useRef(null);

	const [email, setEmail] = useState<string | undefined>(undefined);

	console.log(email);
	console.log(extRef.current);

	function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
		console.log('External focus!');
	}

	function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
		console.log('External blur!');
	}

	return (
		<div className="App">
			<div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 20 }}>
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
			</div>
			<Email
				onFocus={handleFocus}
				onBlur={handleBlur}
				ref={extRef}
				placeholder="Ciao"
				// animation="dropdownAnim 300ms ease-out"
				classNames={{
					wrapperClassName: 'react-ems customClass',
					dropdownClassName: 'dropdownIn',
				}}
				value={email}
				onChange={(value) => setEmail(value)}
				baseList={baseList}
				domainList={domainList}
			/>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
			</div>
		</div>
	);
}

export default App;
