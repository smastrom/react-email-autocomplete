import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { cleanValue, getUniqueId, getHonestValue, isInvalid, isValidArr, isFn } from './utils';
import { Attributes, Props, Events, ClassNames, SelectData, ClassProps, Maybe } from './types';

export const Email = forwardRef<HTMLInputElement, Attributes & Props & Events>(
	(
		{
			/* Core - Required */
			onChange: updateValue,
			value: _externalValue,
			baseList,
			/* Core - Optional */
			domainList = [],
			onSelect,
			maxSuggestions: _maxSuggestions = 6,
			startAfter = 2,
			nextElement,
			className,
			classNames,
			/* Input Attributes */
			id,
			name,
			placeholder,
			minLength,
			maxLength,
			pattern,
			readOnly,
			required,
			/* Input Events */
			onFocus: userOnFocus,
			onBlur: userOnBlur,
			onKeyDown: userOnKeyDown,
			onInput: userOnInput,
			/* React */
			children,
		},
		externalRef
	) => {
		/* Refs */

		const wrapperRef = useRef<Maybe<HTMLDivElement>>(null);
		const inputRef = useRef<Maybe<HTMLInputElement>>(null);
		const dropdownRef = useRef<Maybe<HTMLUListElement>>(null);
		const liRefs = useRef<Maybe<HTMLLIElement>[] | []>([]);

		const listId = useRef<string | undefined>(getUniqueId());

		/* State */

		const [suggestions, setSuggestions] = useState(baseList);
		const [ariaIndex, setAriaIndex] = useState(-1);

		/*  Helpers */

		const externalValue = isInvalid(_externalValue) ? '' : cleanValue(_externalValue as string);
		const isRefineMode = isValidArr(domainList);
		const maxSuggestions = getHonestValue(_maxSuggestions, 8, 6);
		const _minLength = getHonestValue(startAfter, 8, 2);

		const [username, domain] = externalValue.split('@');
		const hasUsername = username.length >= _minLength;
		const hasAt = hasUsername && externalValue.indexOf('@') >= 0;
		const hasDomain = hasAt && domain.length >= 1;

		const isOpen = suggestions.length > 0 && externalValue.length >= _minLength;

		function resetState() {
			setSuggestions([]);
			setAriaIndex(-1);
		}

		useEffect(() => {
			if (ariaIndex >= 0) {
				liRefs?.current[ariaIndex]?.focus();
			}
		}, [ariaIndex]);

		useEffect(() => {
			function handleOutsideClick(event: MouseEvent) {
				if (isOpen && !wrapperRef.current?.contains(event.target as Node)) {
					resetState();
				}
			}
			document.addEventListener('click', handleOutsideClick);

			return () => {
				document.removeEventListener('click', handleOutsideClick);
			};
		}, [isOpen]);

		/* Handlers */

		function handleInternalChange(event: React.ChangeEvent<HTMLInputElement>) {
			updateValue(cleanValue(event.target.value));

			if (!isRefineMode) {
				if (hasAt) {
					resetState();
				} else {
					setSuggestions(baseList);
				}
			} else {
				if (hasDomain) {
					const newDomains = domainList
						.filter((externalDomain) => externalDomain.startsWith(domain))
						.slice(0, maxSuggestions);

					if (newDomains.length > 0) {
						if (`${username}@${newDomains[0]}` === externalValue) {
							resetState();
						} else {
							setSuggestions(newDomains);
						}
					}
				} else {
					setSuggestions(baseList);
				}
			}
		}

		function fakeSelectDispatch(
			valueSelected: SelectData['valueSelected'],
			withKeyboard: SelectData['withKeyboard'],
			position: SelectData['position']
		) {
			onSelect!({ valueSelected, withKeyboard, position });
		}

		/* Internal Events */

		function setCursor() {
			if (inputRef.current) {
				inputRef.current.type = 'text';
				inputRef.current.setSelectionRange(externalValue.length, externalValue.length);
				inputRef.current.type = 'email';
			}
		}

		function handleCursorFocus() {
			setCursor();
			inputRef?.current?.focus();
		}

		function handleReFocus() {
			if (nextElement) {
				document.getElementById(nextElement)?.focus();
			} else {
				handleCursorFocus();
			}
			resetState();
		}

		function handleInputKeyboard(event: React.KeyboardEvent<HTMLInputElement>) {
			if (event.code === 'Space') {
				event.preventDefault();
			}
			if (isOpen) {
				switch (event.code) {
					case 'Tab':
					case 'Escape':
						return resetState();

					case 'ArrowDown':
						event.preventDefault();
						liRefs.current[0]?.focus();
						return setAriaIndex(0);
				}
			}
		}

		function handleListKeyboard(event: React.KeyboardEvent<HTMLLIElement>) {
			if (isOpen) {
				switch (event.code) {
					case 'Escape':
						resetState();
						return handleCursorFocus();

					case 'Backspace':
						return inputRef?.current?.focus();

					case 'Tab':
						return resetState();

					case 'Enter':
					case 'Space': {
						event.preventDefault();
						const newValue = cleanValue(
							(liRefs.current[ariaIndex] as HTMLLIElement).textContent as string
						);

						updateValue(newValue);
						if (isFn(onSelect)) {
							fakeSelectDispatch(newValue, true, ariaIndex + 1);
						}
						return handleReFocus();
					}

					case 'ArrowDown':
						event.preventDefault();
						if (ariaIndex < suggestions.length - 1) {
							setAriaIndex(ariaIndex + 1);
						}
						break;

					case 'ArrowUp':
						event.preventDefault();
						if (ariaIndex === 0) {
							setAriaIndex(-1);
							handleCursorFocus();
						}
						if (ariaIndex > 0) {
							setAriaIndex(ariaIndex - 1);
						}
						break;
				}
			}
		}

		function handleSuggestionClick(event: React.MouseEvent<HTMLLIElement>, childIndex: number) {
			event.preventDefault();
			event.stopPropagation();
			const newValue = cleanValue((event.currentTarget as Node).textContent as string);
			updateValue(newValue);
			if (isFn(onSelect)) {
				fakeSelectDispatch(newValue, false, childIndex + 1);
			}
			handleReFocus();
		}

		/* Events */

		function setEvents() {
			const events: Partial<Events> = {};

			events.onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
				if (isFn(userOnKeyDown)) {
					userOnKeyDown!(event);
				}
				handleInputKeyboard(event);
			};

			if (isFn(userOnFocus)) {
				events.onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
					userOnFocus!(event);
				};
			}

			if (isFn(userOnBlur)) {
				events.onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
					userOnBlur!(event);
				};
			}

			if (isFn(userOnInput)) {
				events.onInput = (event: React.FormEvent<HTMLInputElement>) => {
					userOnInput!(event);
				};
			}

			return events;
		}

		/*  Attributes */

		const userAttrs: Attributes = {
			id,
			name,
			placeholder,
			minLength,
			maxLength,
			pattern,
			readOnly,
			required,
		};

		/* Props */

		function mergeRefs(inputElement: HTMLInputElement) {
			inputRef.current = inputElement;
			if (externalRef) {
				(externalRef as React.MutableRefObject<HTMLInputElement | null>).current = inputElement;
			}
		}

		function setWrapperClass() {
			const classes = `${className || ''} ${classNames?.wrapper || ''}`.trim();

			if (classes.length > 0) {
				return { className: classes };
			}
			return { className };
		}

		function setDropdownClasses() {
			const userClasses = `${classNames?.dropdown || ''}`;
			return { className: `${className} ${userClasses}`.trim() };
		}

		function setClasses(classProperty: keyof ClassNames) {
			if (typeof classNames !== 'undefined' && typeof classNames[classProperty] === 'string') {
				return {
					className: classNames[classProperty],
				};
			}
			return {};
		}

		const listPrefix = `react-ems_${listId.current}`;

		function setAriaControl() {
			if (isOpen) {
				return { 'aria-controls': listPrefix };
			}
			return {};
		}

		return (
			<div ref={wrapperRef} {...setWrapperClass()}>
				<input
					ref={(thisInput) => mergeRefs(thisInput as HTMLInputElement)}
					type="email"
					autoComplete="off"
					role="combobox"
					aria-expanded={isOpen}
					aria-autocomplete="list"
					onChange={(event) => handleInternalChange(event)}
					value={externalValue}
					{...setAriaControl()}
					{...setClasses(ClassProps.Input)}
					{...setEvents()}
					{...userAttrs}
				/>

				{isOpen && (
					<ul ref={dropdownRef} id={listPrefix} {...setDropdownClasses()}>
						{suggestions.map((domain, index) => (
							<li
								key={domain}
								ref={(thisLi) => (liRefs.current[index] = thisLi)}
								role="option"
								aria-posinset={index + 1}
								aria-setsize={suggestions.length}
								aria-selected={index === ariaIndex}
								tabIndex={index === ariaIndex ? 0 : -1}
								onKeyDown={handleListKeyboard}
								onClick={(event) => handleSuggestionClick(event, index)}
								{...setClasses(ClassProps.Suggestion)}
							>
								<span {...setClasses(ClassProps.Username)}>{username}</span>
								<span {...setClasses(ClassProps.Domain)}>@{domain}</span>
							</li>
						))}
					</ul>
				)}
				{children}
			</div>
		);
	}
);

Email.displayName = 'Email';
