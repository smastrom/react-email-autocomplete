import { useEffect, useMemo, useState } from 'react';
import { suggest } from './suggest';
import { Maybe } from './types';

type Values = {
	inputValue: Maybe<string>;
	suggestion: Maybe<string>;
};

const defaultValues: Values = {
	inputValue: undefined,
	suggestion: undefined,
};

export function useSuggestion(domainList: string[], extensionList: string[]) {
	const getSuggestion = useMemo(
		() => suggest(domainList, extensionList),
		[domainList, extensionList]
	);

	const [values, setValues] = useState<Values>(defaultValues);

	function setSuggestion(value: string) {
		setValues((prevValues) => ({
			...prevValues,
			inputValue: value,
		}));
	}

	function resetSuggestion() {
		setValues(defaultValues);
	}

	useEffect(() => {
		if (typeof values.inputValue === 'string') {
			const suggestedValue = getSuggestion(values.inputValue);
			if (typeof suggestedValue === 'string') {
				setValues((prevValues) => ({
					...prevValues,
					suggestion: suggestedValue,
				}));
			} else {
				setValues(defaultValues);
			}
		}
	}, [values.inputValue, getSuggestion]);

	return {
		resetSuggestion,
		getSuggestion: setSuggestion,
		suggestion: values.suggestion,
	};
}
