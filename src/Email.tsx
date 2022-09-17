import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

type Maybe<T> = T | undefined;

type Attributes = {
	id?: string;
	placeholder?: string;
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

type Events = {
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	onInput?: React.FormEventHandler<HTMLInputElement>;
};

type SelectionIndex = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

function cleanValue(value: string) {
	return value.replace(/\s+/g, '').toLowerCase();
}

function isValidArr(maybeArr: unknown) {
	return Array.isArray(maybeArr) && maybeArr.length > 0;
}

function isInvalid(value: unknown) {
	return typeof value !== 'string';
}

function getUniqueId() {
	return (Math.random() + 1).toString(36).substring(7);
}

export const Email = forwardRef<HTMLInputElement, Attributes & Props & Events>(
	(
		{
			id,
			value: externalValue,
			defaultValue,
			onChange,
			placeholder,
			baseList,
			domainList = [],
			animation,
			scrollIntoView = true,
			classNames,
			onFocus: userOnFocus,
			onBlur: userOnBlur,
			onKeyDown: userOnKeyDown,
			onInput: userOnInput,
		},
		externalRef
	) => {
		/* Data */

		const internalDomainList = useMemo(() => domainList, [domainList]);

		/* Refs */

		const wrapperRef = useRef<HTMLDivElement | null>(null);
		const inputRef = useRef<HTMLInputElement | null>(null);
		const liRefs = useRef<(HTMLLIElement | null)[] | []>([]);

		const selectionIndex = useRef<SelectionIndex>(-1);

		const isSelected = useRef(false);
		const isInitial = useRef(true);

		const listId = useRef<string | undefined>(getUniqueId());

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

		const maxSuggestions = baseList.length;

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
							.slice(0, maxSuggestions);

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
		}, [
			externalValue,
			domain,
			hasUsername,
			hasAt,
			shouldRefine,
			internalDomainList,
			baseList,
			maxSuggestions,
		]);

		/* UI Effects */

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

		function setCursor() {
			if (inputRef.current) {
				inputRef.current.type = 'text';
				inputRef.current.setSelectionRange(absoluteValue.length, absoluteValue.length);
				inputRef.current.type = 'email';
			}
		}

		function handleScrollIntoView() {
			const isNotDesktop = window.matchMedia('(max-width: 910px)').matches;
			setTimeout(() => {
				if (isNotDesktop && wrapperRef.current) {
					wrapperRef.current.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
						inline: 'nearest',
					});
				}
			}, 100);
		}

		function handleInternalChange(event: React.ChangeEvent<HTMLInputElement>) {
			onChange(cleanValue(event.target.value));
		}

		function handleInputKeyboard(event: React.KeyboardEvent<HTMLInputElement>) {
			if (event.code === 'Space') {
				event.preventDefault();
			}
			if (isOpen) {
				switch (event.code) {
					case 'Tab':
					case 'Escape':
						return setIsOpen(false);

					case 'ArrowDown':
						event.preventDefault();
						liRefs.current[0]?.focus();
						return (selectionIndex.current = 0);
				}
			}
		}

		function handleListKeyboard(event: React.KeyboardEvent<HTMLLIElement>) {
			if (isOpen) {
				switch (event.code) {
					case 'Escape':
						setIsOpen(false);
						setCursor();
						return inputRef?.current?.focus();

					case 'Backspace':
						return inputRef?.current?.focus();

					case 'Tab':
						return setIsOpen(false);

					case 'Enter':
					case 'Space': {
						event.preventDefault();
						const newValue = cleanValue(
							(liRefs.current[selectionIndex.current] as HTMLLIElement).textContent as string
						);
						return onChange(cleanValue(newValue));
					}

					case 'ArrowDown':
						event.preventDefault();
						if (selectionIndex.current < maxSuggestions - 1) {
							selectionIndex.current += 1;

							if (selectionIndex.current > 0) {
								return (liRefs?.current[selectionIndex.current] as HTMLLIElement).focus();
							}
						}
						break;

					case 'ArrowUp':
						event.preventDefault();
						if (selectionIndex.current === 0) {
							selectionIndex.current = -1;
							setCursor();
							return inputRef?.current?.focus();
						}
						if (selectionIndex.current > 0) {
							selectionIndex.current -= 1;
							return (liRefs.current[selectionIndex.current] as HTMLLIElement).focus();
						}
				}
			}
		}

		function handleReFocus() {
			if (inputRef.current !== null) {
				inputRef.current.focus();
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

		/* Events */

		function myFocus() {
			if (scrollIntoView) {
				handleScrollIntoView();
			}
		}

		function getEvents() {
			const events: Partial<Events> = {};

			events.onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
				handleInputKeyboard(event);
				if (typeof userOnKeyDown === 'function') {
					userOnKeyDown(event);
				}
			};

			events.onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
				myFocus();
				if (typeof userOnFocus === 'function') {
					userOnFocus(event);
				}
			};

			if (typeof userOnBlur === 'function') {
				events.onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
					userOnBlur(event);
				};
			}

			if (typeof userOnInput === 'function') {
				events.onInput = (event: React.FormEvent<HTMLInputElement>) => {
					userOnInput(event);
				};
			}

			return events;
		}

		/*  Attributes */

		const userAttrs: Attributes = {
			id,
			placeholder,
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
					ref={(thisInput) => {
						inputRef.current = thisInput;
						if (externalRef) {
							(externalRef as React.MutableRefObject<HTMLInputElement | null>).current = thisInput;
						}
					}}
					type="email"
					autoComplete="off"
					aria-autocomplete="list"
					role="combobox"
					aria-expanded={isOpen}
					aria-controls={listId.current}
					onChange={(event) => handleInternalChange(event)}
					value={absoluteValue}
					defaultValue={defaultValue}
					{...getClasses('inputClassName')}
					{...getEvents()}
					{...userAttrs}
				/>

				<ul id={listId.current} {...getListStyles()} {...getClasses('dropdownClassName')}>
					{internalDomains.map((domain, index) => (
						<li
							key={domain}
							role="option"
							aria-posinset={index + 1}
							aria-setsize={internalDomains.length}
							aria-selected={index === selectionIndex.current}
							tabIndex={0}
							ref={(thisLi) => (liRefs.current[index] = thisLi)}
							onKeyDown={handleListKeyboard}
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
