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
	['Events/Children', 'eventHandlers'],
	['onSelect Callback', 'customOnSelect'],
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
		customOnSelect: true,
		eventHandlers: true,
	});

	const [email, setEmail] = useState<string>('');

	const [status, setStatus] = useState({
		isError: false,
		isOk: false,
	});

	const [selectionData, setSelectionData] = useState<SelectData | null>(null);

	/** Handlers */

	function handleInput() {
		if (options.eventHandlers) {
			setStatus((prevState) => ({ ...prevState, isOk: isValid(email) }));
		}
	}

	function handleBlur() {
		if (options.eventHandlers) {
			console.log('Blur');
			setStatus((prevState) => ({ ...prevState, isError: !isValid(email) }));
		}
	}

	function handleFocus() {
		if (options.eventHandlers) {
			console.log('Focus');
			setStatus((prevState) => ({ ...prevState, isError: false }));
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
							// Events
							onSelect={options.customOnSelect ? customOnSelect : undefined}
							onInput={handleInput}
							onBlur={handleBlur}
							onFocus={handleFocus}
							// Atrributes
							className="customClass"
							name="reactEms"
							id="reactEms"
							placeholder="Please enter your email"
						>
							<Children
								isActive={options.eventHandlers}
								isError={status.isError}
								isValid={status.isOk}
							/>
						</Email>
					</Profiler>
				</div>
			</div>

			<Footer />
		</>
	);
}
