import { useState, useEffect } from 'react';
import { LocalizedList } from './types';

export function useLocalizedList(lists: LocalizedList, appLocale?: string) {
	const userLocale = appLocale || navigator?.language;
	const [list, setList] = useState(lists.default);

	useEffect(() => {
		const localeList = lists[userLocale];
		if (localeList) {
			return setList(localeList);
		}

		const langCode = userLocale.split(/[-_]/)[0];
		const langCodeList = lists[langCode];
		if (langCodeList) {
			return setList(langCodeList);
		}
	}, [userLocale, lists]);

	return list;
}
