import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { cleanValue, getUniqueId, getHonestValue, isFn, useIsomorphicLayoutEffect } from './utils';
import { Events, SelectData, Elements, Maybe, Email as Export, EmailProps } from './types';

export const Email: typeof Export = forwardRef<HTMLInputElement, EmailProps>(
	(
		{
			/* Core - Required */
			onChange: setEmail,
			value: _email,
			baseList,
			/* Core - Optional */
			refineList = [],
			maxResults: _maxResults = 6,
			minChars: _minChars = 2,
			nextElement,
			className,
			classNames,
			onSelect = () => {},
			customPrefix = 'rbe_',
			children,
			wrapperId,
			/* HTML attributes */
			id,
			name,
			placeholder,
			readOnly,
			disabled,
			required,
			pattern,
			/* User events */
			onFocus: userOnFocus,
			onBlur: userOnBlur,
			onInput: userOnInput,
			onKeyDown: userOnKeyDown = () => {},
		},
		externalRef
	) => {
		/* User settings */

		const isRefine = refineList?.length > 0;
		const maxResults = getHonestValue(_maxResults, 8, 6);
		const minChars = getHonestValue(_minChars, 8, 2);

		/* Refs */

		const uniqueId = useRef<string>('');
		const listId = `${customPrefix}${uniqueId.current}`;

		const wrapperRef = useRef<Maybe<HTMLDivElement>>(null);
		const inputRef = useRef<Maybe<HTMLInputElement>>(null);
		const dropdownRef = useRef<Maybe<HTMLUListElement>>(null);
		const liRefs = useRef<Maybe<HTMLLIElement>[] | []>([]);

		/* State */

		const [suggestions, setSuggestions] = useState(baseList);
		const [activeChild, setActiveChild] = useState(-1);

		/*  Reactive helpers */

		const email = typeof _email !== 'string' ? '' : cleanValue(_email);
		const [username] = email.split('@');
		const isOpen = suggestions.length > 0 && email.length >= minChars;

		/* Effects */

		function clearResults() {
			setSuggestions([]);
			setActiveChild(-1);
		}

		useIsomorphicLayoutEffect(() => {
			if (!uniqueId.current) {
				uniqueId.current = getUniqueId();
			}
		}, []);

		useEffect(() => {
			if (activeChild >= 0) {
				liRefs?.current[activeChild]?.focus();
			}
		}, [activeChild]);

		useEffect(() => {
			function handleOutsideClick(event: MouseEvent) {
				if (isOpen && !wrapperRef.current?.contains(event.target as Node)) {
					clearResults();
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
				hasAt ? clearResults() : setSuggestions(baseList);
			} else {
				if (hasDomain) {
					const _suggestions = refineList
						.filter((_suggestion) => _suggestion.startsWith(_domain))
						.slice(0, maxResults);
					if (_suggestions.length > 0) {
						_suggestions[0] === _domain ? clearResults() : setSuggestions(_suggestions);
					} else {
						clearResults();
					}
				} else {
					setSuggestions(baseList);
				}
			}

			setEmail(cleanEmail);
		}

		function handleSelect(
			event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>,
			childIndex: number,
			isKeyboard: boolean
		) {
			event.preventDefault(), event.stopPropagation();
			const selectedEmail = cleanValue((event.currentTarget as Node).textContent as string);
			dispatchSelect(selectedEmail, isKeyboard, childIndex + 1);
			setEmail(selectedEmail);
			handleReFocus();
		}

		/* Event utils */

		function handleCursorFocus() {
			if (inputRef.current) {
				inputRef.current.type = 'text';
				inputRef.current.setSelectionRange(email.length, email.length);
				inputRef.current.type = 'email';
				inputRef.current.focus();
			}
		}

		function handleReFocus() {
			if (nextElement) {
				document.getElementById(nextElement)?.focus();
			} else {
				handleCursorFocus();
			}
			clearResults();
		}

		/* Keyboard events */

		function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
			if (isOpen) {
				switch (event.code) {
					case 'Tab':
					case 'Escape':
						return clearResults();

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
						clearResults();
						return handleCursorFocus();

					case 'Tab':
						return clearResults();

					case 'Backspace':
						return inputRef?.current?.focus();

					case 'Enter':
					case 'Space': {
						return handleSelect(event, activeChild, true);
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

		function handleExternal(
			event: React.FocusEvent<HTMLInputElement>,
			eventHandler: React.FocusEventHandler<HTMLInputElement>
		) {
			const isInternal = liRefs.current.some((li) => li === event.relatedTarget);
			if (!isInternal || event.relatedTarget == null) {
				eventHandler(event);
			}
		}

		function getEvents(): Events {
			return {
				onKeyDown: (event) => {
					handleInputKeyDown(event);
					userOnKeyDown(event);
				},
				...(isFn(userOnInput) ? { onInput: userOnInput } : {}),
				...(isFn(userOnBlur) ? { onBlur: (event) => handleExternal(event, userOnBlur!) } : {}),
				...(isFn(userOnFocus) ? { onFocus: (event) => handleExternal(event, userOnFocus!) } : {}),
			};
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
				return { 'aria-controls': listId };
			}
			return {};
		}

		function getWrapperClass() {
			return { className: `${className || ''} ${classNames?.wrapper || ''}`.trim() };
		}

		function getClasses(elementName: Elements) {
			if (classNames && typeof classNames[elementName] === 'string') {
				return {
					className: classNames[elementName],
				};
			}
			return {};
		}

		/*  HTML Attributes */

		const userAttrs = {
			id,
			name,
			placeholder,
			readOnly,
			required,
			disabled,
			pattern,
		};

		return (
			<div ref={wrapperRef} id={wrapperId} {...getWrapperClass()}>
				<input
					ref={(input) => mergeRefs(input as HTMLInputElement)}
					onChange={(event) => handleEmailChange(event)}
					aria-expanded={isOpen}
					value={email}
					type="email"
					autoComplete="off"
					role="combobox"
					aria-autocomplete="list"
					{...getAriaControls()}
					{...getClasses(Elements.Input)}
					{...getEvents()}
					{...userAttrs}
				/>
				{isOpen && (
					<ul
						ref={dropdownRef}
						id={listId}
						role="listbox"
						aria-label="Suggestions"
						{...getClasses(Elements.Dropdown)}
					>
						{suggestions.map((domain, index) => (
							<li
								ref={(li) => (liRefs.current[index] = li)}
								onClick={(event) => handleSelect(event, index, false)}
								onKeyDown={handleListKeyDown}
								key={domain}
								aria-posinset={index + 1}
								aria-setsize={suggestions.length}
								aria-selected={index === activeChild}
								tabIndex={index === activeChild ? 0 : -1}
								role="option"
								{...getClasses(Elements.Suggestion)}
							>
								<span {...getClasses(Elements.Username)}>{username}</span>
								<span {...getClasses(Elements.Domain)}>@{domain}</span>
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
