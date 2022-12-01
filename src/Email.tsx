import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
	cleanValue,
	getUniqueId,
	getHonestValue,
	isInvalid,
	isValidArr,
	setUserEvents,
} from './utils';
import { Attributes, Props, Events, ClassNames, SelectData, ClassProps, Maybe } from './types';

export const Email = forwardRef<HTMLInputElement, Attributes & Props & Events>(
	(
		{
			/* Core - Required */
			onChange: setEmail,
			value: _email,
			baseList,
			/* Core - Optional */
			domainList = [],
			maxSuggestions: _maxSuggestions = 6,
			minChars: _minChars = 2,
			nextElement,
			className,
			classNames,
			onSelect = () => {},
			children,
			/* HTML Attributes */
			id,
			name,
			placeholder,
			readOnly,
			disabled,
			required,
			/* User Events */
			onFocus: userOnFocus,
			onBlur: userOnBlur,
			onInput: userOnInput,
			onKeyDown: userOnKeyDown = () => {},
		},
		externalRef
	) => {
		/* User settings */

		const isRefine = isValidArr(domainList);
		const maxSuggestions = getHonestValue(_maxSuggestions, 8, 6);
		const minChars = getHonestValue(_minChars, 8, 2);

		/* Refs */

		const listId = useRef<string>(getUniqueId());
		const listPrefix = `rbe_${listId.current}`;

		const wrapperRef = useRef<Maybe<HTMLDivElement>>(null);
		const inputRef = useRef<Maybe<HTMLInputElement>>(null);
		const dropdownRef = useRef<Maybe<HTMLUListElement>>(null);
		const liRefs = useRef<Maybe<HTMLLIElement>[] | []>([]);

		/* State */

		const [suggestions, setSuggestions] = useState(baseList);
		const [activeChild, setActiveChild] = useState(-1);

		/*  Reactive helpers */

		const email = isInvalid(_email) ? '' : cleanValue(_email as string);
		const [username] = email.split('@');
		const isOpen = suggestions.length > 0 && email.length >= minChars;

		/* Effects */

		function clearList() {
			setSuggestions([]);
			setActiveChild(-1);
		}

		useEffect(() => {
			if (activeChild >= 0) {
				liRefs?.current[activeChild]?.focus();
			}
		}, [activeChild]);

		useEffect(() => {
			function handleOutsideClick(event: MouseEvent) {
				if (isOpen && !wrapperRef.current?.contains(event.target as Node)) {
					clearList();
				}
			}
			document.addEventListener('click', handleOutsideClick);

			return () => {
				document.removeEventListener('click', handleOutsideClick);
			};
		}, [isOpen]);

		/* Value update handlers */

		function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
			const cleanEmail = cleanValue(event.target.value);
			const [_username, _domain] = cleanEmail.split('@');
			const hasAt = _username.length >= minChars && cleanEmail.indexOf('@') >= 0;
			const hasDomain = hasAt && _domain.length >= 1;

			if (!isRefine) {
				hasAt ? clearList() : setSuggestions(baseList);
			} else {
				if (hasDomain) {
					const _suggestions = domainList
						.filter((_suggestion) => _suggestion.startsWith(_domain))
						.slice(0, maxSuggestions);
					if (_suggestions.length > 0) {
						_suggestions[0] === _domain ? clearList() : setSuggestions(_suggestions);
					} else {
						clearList();
					}
				} else {
					setSuggestions(baseList);
				}
			}

			setEmail(cleanEmail);
		}

		function handleSuggestionSelect(
			event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>,
			childIndex: number
		) {
			event.preventDefault(), event.stopPropagation();
			const selectedEmail = cleanValue((event.currentTarget as Node).textContent as string);
			dispatchSelect(selectedEmail, false, childIndex + 1);
			setEmail(selectedEmail);
			handleReFocus();
		}

		/* Event utils */

		function setCursor() {
			if (inputRef.current) {
				inputRef.current.type = 'text';
				inputRef.current.setSelectionRange(email.length, email.length);
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
			clearList();
		}

		/* Keyboard events */

		function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
			if (isOpen) {
				switch (event.code) {
					case 'Tab':
					case 'Escape':
						return clearList();

					case 'ArrowDown':
						event.preventDefault();
						return setActiveChild(0);
				}
			}
		}

		function handleListKeyDown(event: React.KeyboardEvent<HTMLLIElement>) {
			if (isOpen) {
				switch (event.code) {
					case 'Escape':
						clearList();
						return handleCursorFocus();

					case 'Tab':
						return clearList();

					case 'Backspace':
						return inputRef?.current?.focus();

					case 'Enter':
					case 'Space': {
						return handleSuggestionSelect(event, activeChild);
					}

					case 'ArrowDown':
						event.preventDefault();
						if (activeChild < suggestions.length - 1) {
							setActiveChild(activeChild + 1);
						}
						break;

					case 'ArrowUp':
						event.preventDefault();
						setActiveChild(activeChild - 1);
						if (activeChild === 0) {
							inputRef?.current?.focus();
						}
						break;
				}
			}
		}

		/* User Events */

		function getEvents() {
			const events: Events = {
				onKeyDown: (event) => {
					handleInputKeyDown(event);
					userOnKeyDown(event);
				},
			};
			setUserEvents<Events>(events, {
				onBlur: userOnBlur,
				onInput: userOnInput,
				onFocus: userOnFocus,
			});
			return events;
		}

		function dispatchSelect(
			value: SelectData['value'],
			keyboard: SelectData['keyboard'],
			position: SelectData['position']
		) {
			onSelect({ value, keyboard, position });
		}

		/* Props */

		function mergeRefs(inputElement: HTMLInputElement) {
			inputRef.current = inputElement;
			if (externalRef) {
				(externalRef as React.MutableRefObject<Maybe<HTMLInputElement>>).current = inputElement;
			}
		}

		function getAriaControls() {
			if (isOpen) {
				return { 'aria-controls': listPrefix };
			}
			return {};
		}

		function getWrapperClass() {
			return { className: `${className || ''} ${classNames?.wrapper || ''}`.trim() };
		}

		function getClasses(classProperty: keyof ClassNames) {
			if (classNames && typeof classNames[classProperty] === 'string') {
				return {
					className: classNames[classProperty],
				};
			}
			return {};
		}

		/*  HTML Attributes */

		const userAttrs: Attributes = {
			id,
			name,
			placeholder,
			readOnly,
			required,
			disabled,
		};

		return (
			<div ref={wrapperRef} {...getWrapperClass()}>
				<input
					ref={(input) => mergeRefs(input as HTMLInputElement)}
					type="email"
					autoComplete="off"
					role="combobox"
					aria-expanded={isOpen}
					aria-autocomplete="list"
					onChange={(event) => handleEmailChange(event)}
					value={email}
					{...getAriaControls()}
					{...getClasses(ClassProps.Input)}
					{...getEvents()}
					{...userAttrs}
				/>
				{isOpen && (
					<ul ref={dropdownRef} id={listPrefix} {...getClasses(ClassProps.Dropdown)}>
						{suggestions.map((domain, index) => (
							<li
								key={domain}
								ref={(li) => (liRefs.current[index] = li)}
								role="option"
								aria-posinset={index + 1}
								aria-setsize={suggestions.length}
								aria-selected={index === activeChild}
								tabIndex={index === activeChild ? 0 : -1}
								onKeyDown={handleListKeyDown}
								onClick={(event) => handleSuggestionSelect(event, index)}
								{...getClasses(ClassProps.Suggestion)}
							>
								<span {...getClasses(ClassProps.Username)}>{username}</span>
								<span {...getClasses(ClassProps.Domain)}>@{domain}</span>
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
