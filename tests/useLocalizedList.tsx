import { useState } from 'react';
import { Email as EmailComponent } from '../src/Email';
import { useLocalizedList } from '../src/useLocalizedList';

import { EmailProps, LocalizedList } from '../src/types';

export const lists = {
	it: ['it-1.com', 'it-2.com', 'it-3.com', 'it-4.com'],
	'it-CH': ['ch-1.com', 'ch-2.com', 'ch-3.com', 'ch-4.com'],
	default: ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'msn.com'],
};

type Props = { lists: LocalizedList; id: EmailProps['id'] };

export function Email({ id, lists }: Props) {
	const [email, setEmail] = useState('');
	const baseList = useLocalizedList(lists);

	return <EmailComponent id={id} onChange={setEmail} value={email} baseList={baseList} />;
}
