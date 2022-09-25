import { useEffect, useMemo, useState } from 'react';
import { defaultOptions, Options, suggest } from './suggest';
import { Maybe } from './types';

type Values = {
	inputValue: Maybe<string>;
	suggestion: Maybe<string>;
};

const defaultValues = {
	inputValue: undefined,
	suggestion: undefined,
};

export function useSuggestion(domainList: string[], extensionList: string[], options?: Options) {
	const getSuggestion = useMemo(
		() =>
			suggest(domainList, extensionList, {
				maxDomainDistance: options?.maxDomainDistance ?? defaultOptions.maxDomainDistance,
				maxExtensionsDistance:
					options?.maxExtensionsDistance ?? defaultOptions.maxExtensionsDistance,
				minUsernameLength: options?.minUsernameLength ?? defaultOptions.minUsernameLength,
			}),
		[domainList, extensionList, options]
	);

	const [values, setValues] = useState<Values>(defaultValues);

	function setSuggestion(value: string) {
		setValues((prevValues) => ({
			...prevValues,
			inputValue: value,
		}));
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

	const returnObj = useMemo(
		() => ({
			resetSuggestion: () => setValues(defaultValues),
			getSuggestion: setSuggestion,
			suggestion: values.suggestion,
		}),
		[values.suggestion]
	);

	return returnObj;
}
