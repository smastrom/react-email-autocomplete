import { SVGAttributes, useLayoutEffect, useRef, useState } from 'react';
import { Email, domains } from '../../../src';
import { OnSelectData } from '../../../src/types';
import { Section } from '../../Section';

import './styles.css';

enum Valididty {
	IDLE,
	VALID,
	INVALID
}

function testEmail(value: string) {
	return /^\w+@[a-zA-Z.,]+?\.[a-zA-Z]{2,3}$/.test(value);
}

const classes = {
	wrapper: 'eventsWrapper',
	dropdown: 'eventsDropdown',
	suggestion: 'eventsSuggestion',
	domain: 'eventsDomain'
};

const baseList = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'msn.com', 'proton.me'];

export function EventsChildren() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [email, setEmail] = useState('sadjhgghjsadghjds');
	const [validity, setValidity] = useState<Valididty>(Valididty.IDLE);

	useLayoutEffect(() => {
		setValidity(getValidity(email));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function handleFocus() {
		setValidity(Valididty.IDLE);
	}

	function handleBlur() {
		if (email.length > 0) {
			setValidity(getValidity(email));
		}
	}

	function handleSelect({ value }: OnSelectData) {
		setValidity(getValidity(value));
	}

	function getValidity(value: string) {
		return testEmail(value) ? Valididty.VALID : Valididty.INVALID;
	}

	const isValid = validity === Valididty.VALID;
	const isInvalid = validity === Valididty.INVALID;

	function getValidityClasses() {
		if (isValid) {
			return 'validInput';
		} else if (isInvalid) {
			return 'invalidInput';
		}
		return '';
	}

	return (
		<Section name="With Events / Children" folderName="EventsChildren" className="eventsSection">
			<label htmlFor="eventsChildren">Email</label>
			<Email
				id="eventsChildren"
				placeholder="Enter your email"
				classNames={{
					...classes,
					input: `eventsInput ${getValidityClasses()}`
				}}
				ref={inputRef}
				onBlur={handleBlur}
				onFocus={handleFocus}
				onSelect={handleSelect}
				baseList={baseList}
				refineList={domains}
				isInvalid={isInvalid}
				value={email}
				onChange={setEmail}
			>
				{isValid && <ValidIcon />}
				{isInvalid && <InvalidIcon />}
			</Email>
		</Section>
	);
}

const ValidIcon = () => (
	<svg
		aria-hidden="true"
		className="validIcon"
		xmlns="http://www.w3.org/2000/svg"
		width="12.018"
		height="8.732"
		viewBox="0 0 12.018 8.732"
	>
		<path
			d="M13.19,6,6.872,12.318,4,9.446"
			transform="translate(-2.586 -4.586)"
			fill="none"
			stroke="#3bc100"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="3"
		/>
	</svg>
);

const invalidIconAttrs: SVGAttributes<SVGPathElement> = {
	transform: 'translate(5.659 5.659)',
	fill: 'none',
	stroke: '#ff7272',
	strokeLinecap: 'round',
	strokeLinejoin: 'round',
	strokeWidth: '3'
};

const InvalidIcon = () => (
	<svg
		aria-hidden="true"
		className="validIcon"
		xmlns="http://www.w3.org/2000/svg"
		width="10.828"
		height="10.828"
		viewBox="0 0 10.828 10.828"
	>
		<g id="x" transform="translate(-4.245 -4.245)">
			<line x1="8" y2="8" {...invalidIconAttrs} />
			<line x2="8" y2="8" {...invalidIconAttrs} />
		</g>
	</svg>
);
