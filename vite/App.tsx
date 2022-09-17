import { useRef, useState } from 'react';
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

	return (
		<div className="App">
			<Email
				ref={extRef}
				placeholder="Ciao"
				animation="dropdownAnim 300ms ease-out"
				classNames={{
					wrapperClassName: 'react-ems customClass',
				}}
				value={email}
				onChange={(value) => setEmail(value)}
				baseList={baseList}
				domainList={domainList}
			/>
		</div>
	);
}

export default App;
