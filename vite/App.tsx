/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState } from 'react';
import { Email } from '../src/Email';
import { useSuggestion } from '../src/useSuggestion';
import { Profiler } from './Profiler';
import { SelectParams } from '../src/types';
import domainList from '../src/domains.json';
import extesionList from '../src/extensions.json';

export const baseList = [
	'google.com',
	'email.com',
	'proton.me',
	'yahoo.com',
	'outlook.com',
	'aol.com',
];

function isValid(value: string) {
	return !/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/.test(value);
}

// const pattern = /^\w+@[a-zA-Z.,]+?\.[a-zA-Z]{2,3}$/;

const customClasses = {
	wrapper: 'ciao',
	dropdown: 'dropdownIn',
};

type Options = {
	withRefine: boolean;
	customOnSelect: boolean;
	eventHandlers: boolean;
	useSuggestion: boolean;
	withChildren: boolean;
};

type CheckboxProps = {
	optionProp: keyof Options;
	state: Options;
	setState: React.Dispatch<React.SetStateAction<Options>>;
	label: string;
};

function Checkbox({ optionProp, state, setState, label }: CheckboxProps) {
	return (
		<div className="checkboxWrapper">
			<input
				className="checkboxInput"
				type="checkbox"
				id={optionProp}
				checked={state[optionProp]}
				onChange={() =>
					setState((prevOptions) => ({
						...prevOptions,
						[optionProp]: !prevOptions[optionProp],
					}))
				}
			/>
			<label htmlFor={optionProp} className="checkboxLabel">
				{label}
			</label>
		</div>
	);
}

function App() {
	const { suggestion, getSuggestion, resetSuggestion } = useSuggestion(domainList, extesionList);

	const [options, setOptions] = useState<Options>({
		withRefine: true,
		customOnSelect: false,
		eventHandlers: false,
		useSuggestion: true,
		withChildren: false,
	});

	const [email, setEmail] = useState<string | undefined>(undefined);

	const [error, setError] = useState(false);
	const [selectionData, setSelectionData] = useState('');

	/** Effects */

	useEffect(() => {
		setEmail('');
		setSelectionData('');
	}, [options]);

	useEffect(() => {
		if (options.eventHandlers) {
			setEmail('gu@n.c');
		}
	}, [options.eventHandlers]);

	useEffect(() => {
		if (options.useSuggestion) {
			setEmail('hellomoto@yahu.con');
			getSuggestion('hellomoto@yahu.con');
		}
	}, [options.useSuggestion, getSuggestion]);

	/** Handlers */

	function handleSuggestionBlur() {
		if (typeof email === 'string' && email.length > 10) {
			getSuggestion(email);
		}
	}

	function handleSuggestionFocus() {
		if (suggestion) {
			resetSuggestion();
		}
	}

	function handleSuggestionConfirm() {
		setEmail(suggestion);
		resetSuggestion();
	}

	function customOnSelect({ valueSelected, withKeyboard, position }: SelectParams) {
		setSelectionData(
			`valueSelected: ${valueSelected}, withKeyboard: ${withKeyboard}, position: ${position}`
		);
	}

	return (
		<>
			<div className="content">
				<div className="header">
					<a
						href="https://github.com/smastrom/react-email-suggestions"
						target="_blank"
						aria-label="GitHub Repo"
						className="githubLink"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="23.408"
							viewBox="0 0 24 23.408"
							aria-hidden="true"
						>
							<path d="M12,0A12,12,0,0,0,8.207,23.387c.6.111.793-.261.793-.577V20.576C5.662,21.3,4.967,19.16,4.967,19.16A3.178,3.178,0,0,0,3.634,17.4c-1.089-.745.083-.729.083-.729a2.519,2.519,0,0,1,1.839,1.237,2.554,2.554,0,0,0,3.492,1,2.546,2.546,0,0,1,.762-1.6C7.145,17,4.343,15.971,4.343,11.374A4.644,4.644,0,0,1,5.579,8.153,4.316,4.316,0,0,1,5.7,4.977S6.7,4.655,9,6.207a11.374,11.374,0,0,1,6.009,0c2.291-1.552,3.3-1.23,3.3-1.23a4.312,4.312,0,0,1,.118,3.176,4.632,4.632,0,0,1,1.235,3.221c0,4.609-2.807,5.624-5.479,5.921A2.868,2.868,0,0,1,15,19.517V22.81c0,.319.192.694.8.576A12,12,0,0,0,12,0Z"></path>
						</svg>
					</a>

					<h1 className="title">React Email Suggestions</h1>
				</div>

				<nav className="checkboxNav">
					<Checkbox
						label="Refine Mode"
						optionProp="withRefine"
						state={options}
						setState={setOptions}
					/>

					<Checkbox
						label="useSuggestion"
						optionProp="useSuggestion"
						state={options}
						setState={setOptions}
					/>

					<Checkbox
						label="onSelect Callback"
						optionProp="customOnSelect"
						state={options}
						setState={setOptions}
					/>

					<Checkbox
						label="Event Handlers"
						optionProp="eventHandlers"
						state={options}
						setState={setOptions}
					/>

					<Checkbox
						label="With Children"
						optionProp="withChildren"
						state={options}
						setState={setOptions}
					/>
				</nav>

				{selectionData.length > 0 && <div className="selectionInfo">{selectionData}</div>}

				<div className="emailWrapper">
					<label htmlFor="reactEms">Your Email</label>
					<Profiler>
						<Email
							baseList={baseList}
							onChange={setEmail}
							value={email}
							// Optional
							onSelect={options.customOnSelect ? customOnSelect : undefined}
							onBlur={options.useSuggestion ? handleSuggestionBlur : undefined}
							onFocus={options.useSuggestion ? handleSuggestionFocus : undefined}
							domainList={options.withRefine ? domainList : []}
							// Atrributes
							id="reactEms"
							placeholder="Please enter your email"
							classNames={customClasses}
							className="customClass"
						/>
					</Profiler>

					{options.eventHandlers && (
						<div className="error">Ops! This email doesn&apos;t seem valid.</div>
					)}

					{options.useSuggestion && (
						<div
							aria-live="assertive"
							aria-atomic="true"
							aria-relevant="additions"
							className="suggestion"
						>
							{suggestion && (
								<>
									Did you mean{' '}
									<button type="button" onClick={handleSuggestionConfirm}>
										{suggestion}
									</button>
									?<p className="visuallyHidden">Click the button to confirm the correction.</p>
								</>
							)}
						</div>
					)}
				</div>
			</div>

			<small>
				Made by{' '}
				<a
					href="https://github.com/smastrom"
					target="_blank"
					rel="noreferrer"
					className="profileLink"
				>
					@smastrom
				</a>{' '}
				— MIT Licensed — 2022
			</small>
		</>
	);
}

export default App;
