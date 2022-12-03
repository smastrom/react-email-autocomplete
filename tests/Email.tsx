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

export function Email({ className, wrapperId, classNames, refineList, baseList }: Partial<Props>) {
	const [email, setEmail] = useState('');

	return (
		<EmailComponent
			id="CyEmail"
			wrapperId={wrapperId}
			className={className}
			classNames={classNames}
			value={email}
			refineList={refineList}
			baseList={baseList || baseListInternal}
			onChange={setEmail}
		/>
	);
}
