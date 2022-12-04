import { useState, useEffect } from 'react';
import { LocalizedList } from './types';

export function useLocalizedList(lists: LocalizedList, locale?: string) {
	const userLocale = locale || navigator?.language;
	const [list, setList] = useState(lists.default);

	useEffect(() => {
		const localeList = lists[userLocale];
		if (localeList) {
			return setList(localeList);
		}

		const langCode = userLocale.split('-')[0];
		const langCodeList = lists[langCode];
		if (langCodeList) {
			return setList(langCodeList);
		}
	}, [userLocale, lists]);

	return list;
}
