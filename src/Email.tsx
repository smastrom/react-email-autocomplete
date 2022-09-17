import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

type Maybe<T> = T | undefined;

type Attributes = {
	id?: string;
	placeholder?: string;
	minLength?: number;
};

type CustomClasses = {
	wrapperClassName?: string;
	inputClassName?: string;
	dropdownClassName?: string;
	suggestionClassName?: string;
	usernameClassName?: string;
	domainClassName?: string;
};

type Props = {
	value: Maybe<string>;
	onChange: (value: string) => void;
	baseList: string[];
	domainList?: string[];
	defaultValue?: string;
	animation?: string;
	classNames?: CustomClasses;
	scrollIntoView?: boolean;
	closeOnScroll?: boolean;
};

function cleanValue(value: string) {
	return value.replace(/\s+/g, '').toLowerCase();
}

function isValidArr(maybeArr: unknown) {
	return Array.isArray(maybeArr) && maybeArr.length > 0;
}

function isInvalid(value: unknown) {
	return typeof value !== 'string';
}

export const Email = forwardRef<HTMLInputElement, Attributes & Props>(
	(
		{
			id,
			value: externalValue,
			defaultValue,
			onChange,
			placeholder,
			minLength,
			baseList,
			domainList = [],
			animation,
			classNames,
		},
		externalRef
	) => {
		/* Data */

		const internalDomainList = useMemo(() => domainList, [domainList]);

		/* Refs */

		const internalRef = useRef<HTMLInputElement | null>(null);
		const wrapperRef = useRef<HTMLDivElement | null>(null);

		const isSelected = useRef(false);
		const isInitial = useRef(true);

		/* State */

		const [internalDomains, setInternalDomains] = useState(baseList);
		const [isOpen, setIsOpen] = useState(false);

		/* Data Helpers */

		const absoluteValue = isInvalid(externalValue) ? '' : cleanValue(externalValue as string);
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

		useEffect(() => {
			function handleClose(event: MouseEvent) {
				if (!wrapperRef.current?.contains(event.target as Node)) {
					setIsOpen(false);
				}
			}
			if (isOpen) {
				document.addEventListener('click', handleClose);

				return () => {
					document.removeEventListener('click', handleClose);
				};
			}
		}, [isOpen]);

		/* Handlers */

		function handleInternalChange(event: React.ChangeEvent<HTMLInputElement>) {
			onChange(cleanValue(event.target.value));
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
				onChange(cleanValue((event.currentTarget as Node).textContent as string));
				handleReFocus();
				isSelected.current = true;
				setIsOpen(false);
			}
		}

		/* User Attributes */

		const userAttrs: Attributes = {
			id,
			placeholder,
			minLength,
		};

		function getListStyles() {
			const display = { display: isOpen ? 'inherit' : 'none' };

			if (animation) {
				return {
					style: {
						animation,
						...display,
					},
				};
			}
			return { style: display };
		}

		function getClasses(classProperty: keyof CustomClasses) {
			if (typeof classNames !== 'undefined' && typeof classNames[classProperty] === 'string') {
				return { className: classNames[classProperty] };
			}
			return {};
		}

		/* Prevent rendering */

		if (!baseList || typeof onChange !== 'function') {
			console.error(
				"[react-email-suggestions] - Nothing's returned from rendering. Please provide a baseList and an onChange handler."
			);
			return null;
		}

		return (
			<div ref={wrapperRef} {...getClasses('wrapperClassName')}>
				<input
					ref={(thisElement) => {
						internalRef.current = thisElement;
						if (externalRef) {
							(externalRef as React.MutableRefObject<HTMLInputElement | null>).current =
								thisElement;
						}
					}}
					onChange={(event) => handleInternalChange(event)}
					value={absoluteValue}
					defaultValue={defaultValue}
					type="email"
					{...getClasses('inputClassName')}
					{...userAttrs}
				/>

				<ul {...getListStyles()} {...getClasses('dropdownClassName')}>
					{internalDomains.map((domain) => (
						<li
							key={domain}
							onClick={(event) => handleSuggestionClick(event)}
							{...getClasses('suggestionClassName')}
						>
							<span {...getClasses('usernameClassName')}>{username}</span>
							<span {...getClasses('domainClassName')}>@{domain}</span>
						</li>
					))}
				</ul>
			</div>
		);
	}
);

Email.displayName = 'Email';
