import React, { useState } from 'react';
import { Email } from '../../src/Email';
import { Profiler } from './Profiler';
import { SelectData } from '../../src/types';
import { Checkbox, Options } from './Checkbox';
import { Children } from './Children';
import { Header } from './Header';
import { Footer } from './Footer';
import domainList from '../../src/domains.json';

const checkboxes: [string, keyof Options][] = [
	['Refine Mode', 'withRefine'],
	['onSelect Callback', 'customOnSelect'],
	['Event Handlers', 'eventHandlers'],
	['With Children', 'withChildren'],
];

export const baseList = [
	'google.com',
	'email.com',
	'proton.me',
	'yahoo.com',
	'outlook.com',
	'aol.com',
];

function isValid(value: string) {
	return /^\w+@[a-zA-Z.,]+?\.[a-zA-Z]{2,3}$/.test(value);
}

export function App() {
	const [options, setOptions] = useState<Options>({
		withRefine: true,
		customOnSelect: false,
		eventHandlers: false,
		withChildren: false,
	});

	const [email, setEmail] = useState<string>();

	const [isError, setIsError] = useState(false);
	const [isOk, setIsOk] = useState(false);

	const [selectionData, setSelectionData] = useState<SelectData | null>(null);

	/** Handlers */

	function handleInput(event: React.FormEvent<HTMLInputElement>) {
		if (options.withChildren) {
			setIsOk(isValid(event.currentTarget.value));
		}
	}

	function handleBlur() {
		if (options.eventHandlers && email) {
			console.log('Blur');
			setIsError(!isValid(email));
		}
	}

	function handleFocus() {
		if (options.eventHandlers) {
			console.log('Focus');
			setIsError(false);
		}
	}

	function customOnSelect(data: SelectData) {
		setSelectionData(data);
	}

	return (
		<>
			<div className="wrapper">
				<Header />

				<nav className="checkboxNav">
					{checkboxes.map(([label, prop]) => (
						<Checkbox
							key={prop}
							label={label}
							optionProp={prop}
							state={options}
							setState={setOptions}
						/>
					))}
				</nav>

				{options.customOnSelect && selectionData && (
					<div className="selectionInfo">
						{Object.entries(selectionData).map(([key, value]) => (
							<div key={key}>
								<span>{key}: </span>
								{`${value}`}
							</div>
						))}
					</div>
				)}

				<div className="emailWrapper">
					<label htmlFor="reactEms">Your Email</label>
					<Profiler>
						<Email
							baseList={baseList}
							onChange={setEmail}
							value={email}
							domainList={options.withRefine ? domainList : []}
							classNames={{
								wrapper: 'wrapperClass',
								input: 'inputClass',
								dropdown: 'dropdownIn',
							}}
							className="customClass"
							// Events
							onSelect={options.customOnSelect ? customOnSelect : undefined}
							onInput={handleInput}
							onBlur={handleBlur}
							onFocus={handleFocus}
							// Atrributes
							name="reactEms"
							id="reactEms"
							placeholder="Please enter your email"
						>
							<Children isActive={options.withChildren} isError={isError} isValid={isOk} />
						</Email>
					</Profiler>
				</div>
			</div>

			<Footer />
		</>
	);
}
