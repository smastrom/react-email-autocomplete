import { useState } from 'react';
import { Domain, Email } from '../src/Email';
import domainList from '../src/domains.json';
export const baseList: Domain[] = ['google.com', 'email.com', 'proton.me', 'yahoo.com'];

function App() {
	const [email, setEmail] = useState<string | undefined>(undefined);

	console.log(email);

	return (
		<div className="App">
			<Email
				placeholder="Ciao"
				value={email}
				onChange={(value) => setEmail(value)}
				baseList={baseList}
				domainList={domainList}
			/>
		</div>
	);
}

export default App;
