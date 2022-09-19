import { useState } from 'react';
import { Email } from '../src/Email';
import { useSuggestion } from '../src/useSuggestion';
import { Profiler } from './Profiler';
import domainList from '../src/domains.json';
import extesionList from '../src/extensions.json';

import '../src/base.css';
import '../src/input.css';

export const baseList = ['google.com', 'email.com', 'proton.me', 'yahoo.com'];

const pattern = /^\w+@[a-zA-Z.,]+?\.[a-zA-Z]{2,3}$/;

const customClasses = {
	wrapper: 'ciao',
	dropdown: '',
};

function App() {
	const [email, setEmail] = useState<string | undefined>(undefined);

	const [payload, setPayload] = useState({
		name: 'Giovanni',
		email: '',
	});

	const { suggestion, getSuggestion, resetSuggestion } = useSuggestion(domainList, extesionList);

	function handleBlur() {
		if (typeof email === 'string' && pattern.test(email)) {
			getSuggestion(email);
		}
	}

	console.log(email);

	function handleReset() {
		if (suggestion) {
			resetSuggestion();
		}
	}

	function handleConfirm() {
		setEmail(email);
		resetSuggestion();
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

			<Profiler>
				<Email
					className="customClass"
					onBlur={handleBlur}
					onFocus={handleReset}
					baseList={baseList}
					onChange={setEmail}
					classNames={customClasses}
					closeOnScroll
					domainList={domainList}
					placeholder="Ciao"
					value={email}
					listPrefix="Marco"
				/>
			</Profiler>

			<div
				style={{ minHeight: 30 }}
				aria-live="assertive"
				aria-atomic="true"
				aria-relevant="additions"
			>
				{suggestion && (
					<>
						Did you mean{' '}
						<button type="button" onClick={handleConfirm}>
							{suggestion}
						</button>
						?<p className="visuallyHidden">Click the button to confirm the correction.</p>
					</>
				)}
			</div>

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
