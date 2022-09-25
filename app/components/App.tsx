import React, { useState } from 'react';
import { Email } from '../../src/Email';
import { useSuggestion } from '../../src/useSuggestion';
import { Profiler } from './Profiler';
import { SelectData } from '../../src/types';
import { Checkbox, Options } from './Checkbox';
import { Children } from './Children';
import { Suggestion } from './Suggestion';
import { Header } from './Header';
import { Footer } from './Footer';
import domainList from '../../src/domains.json';
import extesionList from '../../src/extensions.json';

export const baseList = [
	'google.com',
	'email.com',
	'proton.me',
	'yahoo.com',
	'outlook.com',
	'aol.com',
];

const checkboxes: [string, keyof Options][] = [
	['Refine Mode', 'withRefine'],
	['useSuggestion', 'useSuggestion'],
	['onSelect Callback', 'customOnSelect'],
	['Event Handlers', 'eventHandlers'],
	['With Children', 'withChildren'],
];

function isValid(value: string) {
	return /^\w+@[a-zA-Z.,]+?\.[a-zA-Z]{2,3}$/.test(value);
}

export function App() {
	const { suggestion, getSuggestion, resetSuggestion } = useSuggestion(domainList, extesionList);

	const [options, setOptions] = useState<Options>({
		withRefine: true,
		customOnSelect: false,
		eventHandlers: true,
		useSuggestion: true,
		withChildren: false,
	});

	const [email, setEmail] = useState<string | undefined>(undefined);

	const [isError, setIsError] = useState(false);
	const [isOk, setIsOk] = useState(false);

	const [selectionData, setSelectionData] = useState<SelectData | null>(null);

	/** Handlers */

	function handleFocus() {
		if (options.useSuggestion && suggestion) {
			resetSuggestion();
		}
		if (options.eventHandlers) {
			setIsError(false);
		}
	}

	function handleInput(event: React.FormEvent<HTMLInputElement>) {
		if (options.withChildren) {
			setIsOk(isValid(event.currentTarget.value));
		}
	}

	function handleBlur() {
		if (typeof email === 'string') {
			if (options.useSuggestion && email.length > 10) {
				getSuggestion(email);
			}
			if (options.eventHandlers) {
				setIsError(!isValid(email));
			}
		}
	}

	function handleSuggestionConfirm() {
		setEmail(suggestion);
		resetSuggestion();
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
								wrapper: 'ciao',
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

					{options.eventHandlers && isError && !isOk && (
						<div className="error">Ops! This email doesn&apos;t seem valid.</div>
					)}

					<Suggestion
						value={suggestion}
						isActive={options.useSuggestion}
						confirmCallback={handleSuggestionConfirm}
					/>
				</div>
			</div>

			<Footer />
		</>
	);
}
