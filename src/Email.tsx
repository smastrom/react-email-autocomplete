import React, { useEffect, useMemo, useRef, useState } from 'react';

type Maybe<T> = T | undefined;

type Attributes = {
	placeholder?: string;
	minLength?: number;
};

export type Domain = string; // `${string}.${string}`;

type Props = {
	value: Maybe<string>;
	onChange: (value: string) => void;
	baseList: Domain[];
	domainList: Domain[];
	defaultValue: string;
};

function clean(value: string) {
	return value.replace(/\s+/g, '');
}

function isValidArr(maybeArr: unknown) {
	return Array.isArray(maybeArr) && maybeArr.length > 0;
}
function isInvalid(value: unknown) {
	return typeof value !== 'string';
}

export function Email({
	value: externalValue,
	defaultValue,
	onChange,
	placeholder,
	minLength,
	baseList,
	domainList = [],
}: Attributes & Props) {
	/* Data */

	const internalDomainList = useMemo(() => domainList, [domainList]);

	/* Refs */

	const isSelected = useRef(false);
	const internalRef = useRef<HTMLInputElement>(null);
	const isInitial = useRef(true);

	/* State */

	const [internalDomains, setInternalDomains] = useState(baseList);
	const [isOpen, setIsOpen] = useState(false);

	/* Data Helpers */

	const absoluteValue = isInvalid(externalValue)
		? ''
		: clean(externalValue as string).toLowerCase();

	const splitVal = absoluteValue.split('@');

	const username = splitVal[0];
	const hasUsername = username.length >= 1;
	const hasAt = hasUsername && absoluteValue.indexOf('@') !== -1;
	const domain = splitVal[1];
	const hasDomain = hasAt && domain.length >= 1;

	/* UI Helpers */

	const wantsRefine = isValidArr(internalDomainList);
	const shouldRefine = hasDomain && wantsRefine;

	/* Effects */

	useEffect(() => {
		if (isInitial.current) {
			isInitial.current = false;
		} else if (isSelected.current) {
			isSelected.current = false;
		} else {
			if (hasUsername) {
				setIsOpen(true);

				if (shouldRefine) {
					const copyDomains = [...internalDomainList];
					const newDomains = copyDomains
						.filter((userDomain) => userDomain.startsWith(domain))
						.slice(0, 6);

					if (newDomains.length > 0) {
						setInternalDomains(newDomains);
					} else {
						setIsOpen(false);
					}
				} else {
					setInternalDomains(baseList);
				}
			} else {
				setIsOpen(false);
			}
		}
	}, [externalValue, domain, hasUsername, hasAt, shouldRefine, internalDomainList, baseList]);

	/* Handlers */

	function handleInternalChange(event: React.ChangeEvent<HTMLInputElement>) {
		onChange(clean(event.target.value));
	}

	function handleReFocus() {
		if (internalRef.current !== null) {
			internalRef.current.focus();
		}
	}

	function handleSuggestionClick(event: React.MouseEvent<HTMLLIElement>) {
		event.preventDefault();
		event.stopPropagation();
		{
			onChange(clean((event.target as Node).textContent as string));
			handleReFocus();
			isSelected.current = true;
			setIsOpen(false);
		}
	}

	/* User Attributes */

	const userAttrs: Attributes = {
		placeholder,
		minLength,
	};

	return (
		<div>
			<input
				type="email"
				onChange={(event) => handleInternalChange(event)}
				value={absoluteValue}
				defaultValue={defaultValue}
				ref={internalRef}
				{...userAttrs}
			/>

			<ul>
				{isOpen &&
					internalDomains.map((domain) => (
						<li key={domain} onClick={(event) => handleSuggestionClick(event)}>
							{username}@{domain}
						</li>
					))}
			</ul>
		</div>
	);
}
