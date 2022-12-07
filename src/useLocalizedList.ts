import { useState, useEffect } from 'react';
import { useLocalizedList as useLocalizedListHook } from './types';

export const useLocalizedList: typeof useLocalizedListHook = (lists, appLocale) => {
	const userLocale = appLocale || navigator?.language;
	const [list, setList] = useState(lists.default);

	useEffect(() => {
		const exactLocaleList = lists[userLocale];
		if (exactLocaleList) {
			return setList(exactLocaleList);
		}

		const langCode = userLocale.split(/[-_]/)[0];
		const langCodeList = lists[langCode];
		if (langCodeList) {
			return setList(langCodeList);
		}
	}, [userLocale, lists]);

	return list;
};
