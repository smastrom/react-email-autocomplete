// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react';
import { Email as EmailComponent } from '../src/Email';
import { Props } from '../src/types';

const baseListInternal = [
	'gmail.com',
	'yahoo.com',
	'hotmail.com',
	'aol.com',
	'ciao.com',
	'buonasera.com',
];

export function Email({
	className,
	wrapperId,
	classNames,
	refineList,
	baseList,
	minChars,
	maxResults,
}: Partial<Props>) {
	const [email, setEmail] = useState('');

	const [focusCount, setFocusCount] = useState({
		focus: 0,
		blur: 0,
	});

	function handleFocus(type: keyof typeof focusCount) {
		setFocusCount((prevCount) => ({ ...prevCount, [type]: prevCount[type] + 1 }));
	}

	return (
		<>
			<EmailComponent
				id="CyEmail"
				wrapperId={wrapperId}
				maxResults={maxResults}
				className={className}
				classNames={classNames}
				onFocus={() => handleFocus('focus')}
				onBlur={() => handleFocus('blur')}
				value={email}
				minChars={minChars}
				refineList={refineList}
				baseList={baseList || baseListInternal}
				onChange={setEmail}
			/>
			<span id="CyFocusData" data-cy-focus={focusCount.focus} data-cy-blur={focusCount.blur} />
		</>
	);
}
