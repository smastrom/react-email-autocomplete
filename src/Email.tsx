import React, { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cleanValue, getUniqueId, getHonestValue, isInvalid, isValidArr, isFn } from './utils';
import { Attributes, Props, Events, ClassNames, SelectData, ClassProps } from './types';

export const Email = forwardRef<HTMLInputElement, Attributes & Props & Events>(
	(
		{
			/* Core - Required */
			onChange: updateValue,
			value: externalValue,
			baseList,
			/* Core - Optional */
			domainList = [],
			onSelect,
			maxSuggestions = 6,
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
		/* Data */

		const externalDomains = useMemo(() => domainList, [domainList]);

		/* Refs */

		const isDirty = useRef(false);

		const wrapperRef = useRef<HTMLDivElement | null>(null);
		const inputRef = useRef<HTMLInputElement | null>(null);
		const dropdownRef = useRef<HTMLUListElement | null>(null);
		const liRefs = useRef<(HTMLLIElement | null)[] | []>([]);

		const listId = useRef<string | undefined>(getUniqueId());

		/* State */

		const [internalDomains, setInternalDomains] = useState(baseList);
		const [ariaIndex, setAriaIndex] = useState(-1);

		/*  Helpers */

		const absoluteValue = isInvalid(externalValue) ? '' : cleanValue(externalValue as string);
		const absoluteMax = getHonestValue(maxSuggestions, 8, 6);
		const absoluteStart = getHonestValue(startAfter, 8, 2);

		const splitVal = absoluteValue.split('@');
		const username = splitVal[0];
		const hasUsername = username.length >= absoluteStart;
		const hasAt = hasUsername && absoluteValue.indexOf('@') !== -1;
		const inputDomain = splitVal[1];
		const hasDomain = hasAt && inputDomain.length >= 1;

		const wantsRefine = isValidArr(externalDomains);
		const shouldRefine = hasDomain && wantsRefine;

		const shouldOpen = absoluteValue.length >= absoluteStart;
		const shouldAppend = shouldOpen && internalDomains.length > 0;

		/* Effect - Update value */

		function resetState() {
			setInternalDomains([]);
			setAriaIndex(-1);
		}

		useLayoutEffect(() => {
			if (!isDirty.current && shouldOpen) {
				isDirty.current = true;
			}
		}, [shouldOpen]);

		useEffect(() => {
			if (isDirty.current) {
				if (shouldRefine) {
					const newDomains = [...externalDomains]
						.filter((externalDomain) => externalDomain.startsWith(inputDomain))
						.slice(0, absoluteMax);

					if (newDomains.length > 0) {
						if (`${username}@${newDomains[0]}` === absoluteValue) {
							resetState();
						} else {
							setInternalDomains(newDomains);
						}
					} else {
						resetState();
					}
				} else {
					if (hasAt && !externalDomains) {
						resetState();
					} else {
						setInternalDomains(baseList);
					}
				}
			}
		}, [
			absoluteMax,
			absoluteValue,
			baseList,
			externalDomains,
			hasAt,
			username,
			inputDomain,
			shouldRefine,
		]);

		useEffect(() => {
			if (ariaIndex >= 0) {
				liRefs?.current[ariaIndex]?.focus();
			}
		}, [ariaIndex]);

		useEffect(() => {
			function handleClose(event: MouseEvent) {
				if (shouldOpen) {
					if (!wrapperRef.current?.contains(event.target as Node)) {
						resetState();
					}
				}
			}

			document.addEventListener('click', handleClose);

			return () => {
				document.removeEventListener('click', handleClose);
			};
		}, [shouldOpen]);

		/* Internal fake handlers */

		function handleInternalChange(event: React.ChangeEvent<HTMLInputElement>) {
			updateValue(cleanValue(event.target.value));
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
				inputRef.current.setSelectionRange(absoluteValue.length, absoluteValue.length);
				inputRef.current.type = 'email';
			}
		}

		function handleCursorFocus() {
			setCursor();
			inputRef?.current?.focus();
		}

		function handleReFocus() {
			if (typeof nextElement === 'string') {
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
			if (shouldOpen) {
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
			if (shouldOpen) {
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
						if (ariaIndex < internalDomains.length - 1) {
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

		function pushRefs(inputElement: HTMLInputElement) {
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
			if (shouldAppend) {
				return { 'aria-controls': listPrefix }; // Maybe add activeDescendant?
			}
			return {};
		}

		return (
			<div ref={wrapperRef} {...setWrapperClass()}>
				<input
					ref={(thisElement) => pushRefs(thisElement as HTMLInputElement)}
					type="email"
					autoComplete="off"
					role="combobox"
					aria-expanded={shouldAppend}
					aria-autocomplete="list"
					onChange={(event) => handleInternalChange(event)}
					value={absoluteValue}
					{...setAriaControl()}
					{...setClasses(ClassProps.Input)}
					{...setEvents()}
					{...userAttrs}
				/>

				{shouldAppend && (
					<ul ref={dropdownRef} id={listPrefix} {...setDropdownClasses()}>
						{internalDomains.map((domain, index) => (
							<li
								key={domain}
								ref={(thisElement) => (liRefs.current[index] = thisElement)}
								role="option"
								aria-posinset={index + 1}
								aria-setsize={internalDomains.length}
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
