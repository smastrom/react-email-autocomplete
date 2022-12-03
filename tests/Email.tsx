// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react';
import { Email as EmailComponent } from '../src/Email';
import domains from '../src/domains.json';
import { Props } from '../src/types';

const baseList = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'ciao.com', 'buonasera.com'];

export function Email({ className, wrapperId, classNames }: Partial<Props>) {
	const [email, setEmail] = useState('');

	return (
		<EmailComponent
			id="CyEmail"
			wrapperId={wrapperId}
			className={className}
			classNames={classNames}
			value={email}
			refineList={domains}
			baseList={baseList}
			onChange={setEmail}
		/>
	);
}
