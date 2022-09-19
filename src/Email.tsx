import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cleanValue, getUniqueId, getHonestValue, isInvalid, isValidArr, isFn } from './utils';

import type { Attributes, Props, Events, ClassNames, SelectPar } from './types';

export const Email = forwardRef<HTMLInputElement, Attributes & Props & Events>(
	(
		{
			/* Core - Required */
			onChange: updateValue,
			value: externalValue,
			baseList,
			onSelect,
			/* Core - Optional */
			domainList = [],
			maxSuggestions = 6,
			startAfter = 2,
			nextElement,
			closeOnScroll = null,
			className,
			classNames,
			listPrefix,
			/* Input Attributes */
			id,
			placeholder,
			defaultValue,
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

		const skipInitial = useRef(true);

		const wrapperRef = useRef<HTMLDivElement | null>(null);
		const inputRef = useRef<HTMLInputElement | null>(null);
		const dropdownRef = useRef<HTMLUListElement | null>(null);
		const liRefs = useRef<(HTMLLIElement | null)[] | []>([]);

		const listId = useRef<string | undefined>(getUniqueId());

		/* State */

		const [internalDomains, setInternalDomains] = useState(baseList);
		const [ariaIndex, setAriaIndex] = useState(-1);
		const [isOpen, setIsOpen] = useState(false);

		/*  Helpers */

		const absoluteValue = isInvalid(externalValue) ? '' : cleanValue(externalValue as string);
		const absoluteMax = getHonestValue(maxSuggestions, 8, 6);
		const absoluteStart = getHonestValue(startAfter, 8, 2);

		const splitVal = absoluteValue.split('@');
		const username = splitVal[0];
		const hasUsername = username.length >= absoluteStart;
		const hasAt = hasUsername && absoluteValue.indexOf('@') !== -1;
		const domain = splitVal[1];
		const hasDomain = hasAt && domain.length >= 1;

		const wantsRefine = isValidArr(externalDomains);
		const shouldRefine = hasDomain && wantsRefine;

		/* Effect - Update value */

		function resetState() {
			setInternalDomains([]);
			setIsOpen(false);
			setAriaIndex(-1);
		}

		useEffect(() => {
			if (skipInitial.current) {
				skipInitial.current = false;
			} else {
				if (hasUsername) {
					setIsOpen(true);

					if (shouldRefine) {
						const copyDomains = [...externalDomains];
						const newDomains = copyDomains
							.filter((userDomain) => userDomain.startsWith(domain))
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
						if (hasAt) {
							resetState();
						} else {
							setInternalDomains(baseList);
						}
					}
				} else {
					resetState();
				}
			}
		}, [
			absoluteMax,
			absoluteValue,
			baseList,
			externalDomains,
			hasAt,
			username,
			hasUsername,
			domain,
			shouldRefine,
		]);

		/* Effects - UI */

		const handleScrollClose = useCallback(() => {
			let startY: number;
			let endY = 0;

			function scrollClose() {
				const yPos = inputRef.current?.getBoundingClientRect().y as number;

				if (typeof startY === 'undefined') {
					startY = yPos;
				} else {
					endY = yPos;
				}

				if (Math.abs(endY - startY) >= (closeOnScroll as number)) {
					resetState();
					document.removeEventListener('scroll', scrollClose);
				}
			}

			if (isOpen) {
				document.addEventListener('scroll', scrollClose, { passive: true });
			} else {
				document.removeEventListener('scroll', scrollClose);
			}
		}, [isOpen, closeOnScroll]);

		useEffect(() => {
			if (typeof closeOnScroll === 'number') {
				handleScrollClose();
			}
		}, [closeOnScroll, handleScrollClose]);

		useEffect(() => {
			if (ariaIndex >= 0) {
				liRefs?.current[ariaIndex]?.focus();
			}
		}, [ariaIndex]);

		useEffect(() => {
			function handleClose(event: MouseEvent) {
				if (isOpen) {
					if (!wrapperRef.current?.contains(event.target as Node)) {
						resetState();
					}
				}
			}

			document.addEventListener('click', handleClose);

			return () => {
				document.removeEventListener('click', handleClose);
			};
		}, [isOpen]);

		/* Prevent rendering */

		if ((typeof externalValue !== 'string' && !baseList) || !isFn(updateValue)) {
			return null;
		}

		/* Internal fake handlers */

		function handleInternalChange(event: React.ChangeEvent<HTMLInputElement>) {
			updateValue(cleanValue(event.target.value));
		}

		function dispatchSelect(
			valueSelected: SelectPar['valueSelected'],
			withKeyboard: SelectPar['withKeyboard'],
			position: SelectPar['position'],
			target: SelectPar['target']
		) {
			onSelect!({ valueSelected, withKeyboard, position, target });
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
						setIsOpen(false);
						return handleCursorFocus();

					case 'Backspace':
						return inputRef?.current?.focus();

					case 'Tab':
						return setIsOpen(false);

					case 'Enter':
					case 'Space': {
						event.preventDefault();
						const newValue = cleanValue(
							(liRefs.current[ariaIndex] as HTMLLIElement).textContent as string
						);

						updateValue(newValue);
						if (isFn(onSelect)) {
							dispatchSelect(newValue, true, ariaIndex + 1, event.currentTarget);
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
				dispatchSelect(newValue, false, childIndex + 1, event.currentTarget);
			}
			handleReFocus();
		}

		/* Events */

		function setEvents() {
			const events: Partial<Events> = {};

			events.onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
				handleInputKeyboard(event);
				if (isFn(userOnKeyDown)) {
					userOnKeyDown!(event);
				}
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
			placeholder,
			defaultValue,
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
			return {};
		}

		function setClasses(classProperty: keyof ClassNames) {
			if (typeof classNames !== 'undefined' && typeof classNames[classProperty] === 'string') {
				return {
					className: classNames[classProperty],
				};
			}
			return {};
		}

		function getPrefix() {
			const prefix = typeof listPrefix === 'string' ? `${listPrefix}_` : 'react-ems_';
			return `${prefix}${listId.current}`;
		}

		return (
			<div ref={wrapperRef} {...setWrapperClass()}>
				<input
					ref={(thisElement) => pushRefs(thisElement as HTMLInputElement)}
					type="email"
					autoComplete="off"
					role="combobox"
					aria-expanded={isOpen}
					aria-controls={getPrefix()}
					aria-autocomplete="list"
					onChange={(event) => handleInternalChange(event)}
					value={absoluteValue}
					{...setClasses('input')}
					{...setEvents()}
					{...userAttrs}
				/>

				<ul
					ref={dropdownRef}
					id={getPrefix()}
					style={!isOpen ? { display: 'none' } : {}}
					{...setClasses('dropdown')}
				>
					{isOpen &&
						internalDomains.map((domain, index) => (
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
								{...setClasses('suggestion')}
							>
								<span {...setClasses('username')}>{username}</span>
								<span {...setClasses('domain')}>@{domain}</span>
							</li>
						))}
				</ul>
				{children}
			</div>
		);
	}
);

Email.displayName = 'Email';
