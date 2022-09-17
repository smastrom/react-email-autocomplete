import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { cleanValue, getUniqueId, getHonestValue, isInvalid, isValidArr } from './utils';

import type { Attributes, Props, Events, CustomClasses, SelectionIndex } from './types';

export const Email = forwardRef<HTMLInputElement, Attributes & Props & Events>(
	(
		{
			onChange: updateValue,
			placeholder,
			baseList,
			domainList = [],
			animation,
			scrollIntoView = true,
			maxSuggestions = 6,
			startAfter = 2,
			nextElement,
			id,
			value: externalValue,
			defaultValue,
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
		const spanRef = useRef<HTMLSpanElement | null>(null);
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
		const absoluteMax = getHonestValue(maxSuggestions, 8, 6);
		const absoluteStart = getHonestValue(startAfter, 8, 2);

		const splitVal = absoluteValue.split('@');
		const username = splitVal[0];
		const hasUsername = username.length >= absoluteStart;
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
							.slice(0, absoluteMax);

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
			baseList,
			absoluteMax,
			internalDomainList,
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
				if (isNotDesktop && spanRef.current) {
					spanRef.current.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
						inline: 'nearest',
					});
				}
			}, 100);
		}

		function handleInternalChange(event: React.ChangeEvent<HTMLInputElement>) {
			updateValue(cleanValue(event.target.value));
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

		function handleReFocus() {
			setCursor();
			if (typeof nextElement === 'string') {
				document.getElementById(nextElement)?.focus();
			} else {
				inputRef?.current?.focus();
			}
			isSelected.current = true;
			setIsOpen(false);
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
						updateValue(cleanValue(newValue));
						return handleReFocus();
					}

					case 'ArrowDown':
						event.preventDefault();
						if (selectionIndex.current < absoluteMax - 1) {
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

		function handleSuggestionClick(event: React.MouseEvent<HTMLLIElement>) {
			event.preventDefault();
			event.stopPropagation();
			updateValue(cleanValue((event.currentTarget as Node).textContent as string));
			handleReFocus();
		}

		/* Events */

		function getEvents() {
			const events: Partial<Events> = {};

			events.onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
				handleInputKeyboard(event);
				if (typeof userOnKeyDown === 'function') {
					userOnKeyDown(event);
				}
			};

			events.onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
				if (scrollIntoView) {
					handleScrollIntoView();
				}
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

		if (!baseList || typeof updateValue !== 'function') {
			console.error(
				"[react-email-suggestions] - Nothing's returned from rendering. Please provide a baseList and an updateValue handler."
			);
			return null;
		}

		return (
			<div ref={wrapperRef} {...getClasses('wrapperClassName')}>
				{scrollIntoView && (
					<span
						ref={spanRef}
						aria-hidden="true"
						className="react-ems-hidden"
						style={{
							top: '-1em',
						}}
					/>
				)}

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
