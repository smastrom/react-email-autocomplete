import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import {
	cleanValue,
	getUniqueId,
	getHonestValue,
	isFn,
	useIsomorphicLayoutEffect,
	alphanumericKeys
} from './utils';
import { Events, OnSelectData, Elements, Maybe, Email as Export, EmailProps } from './types';

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
			className,
			classNames,
			onSelect = () => {},
			customPrefix = 'rbe_',
			children,
			wrapperId,
			/* User events */
			onFocus: userOnFocus,
			onBlur: userOnBlur,
			onInput: userOnInput,
			onKeyDown: userOnKeyDown = () => {},
			/* HTML attributes */
			id,
			name,
			placeholder,
			readOnly,
			disabled,
			required,
			pattern,
			/* ARIA */
			isInvalid
		},
		externalRef
	) => {
		/* User settings */

		const isRefine = refineList?.length > 0;
		const maxResults = getHonestValue(_maxResults, 8, 6);
		const minChars = getHonestValue(_minChars, 8, 2);

		/* Refs */

		const isTouched = useRef(false);

		const uniqueId = useRef<string>('');
		const listId = `${customPrefix}${uniqueId.current}`;

		const wrapperRef = useRef<Maybe<HTMLDivElement>>(null);
		const inputRef = useRef<Maybe<HTMLInputElement>>(null);
		const dropdownRef = useRef<Maybe<HTMLUListElement>>(null);
		const liRefs = useRef<Maybe<HTMLLIElement>[] | []>([]);

		/* State */

		const [suggestions, setSuggestions] = useState(baseList);
		const [itemState, _setItemState] = useState<{ focusedItem: number; hoveredItem: number }>({
			focusedItem: -1,
			hoveredItem: -1
		});

		function setItemState(focusedItem = -1, hoveredItem = -1) {
			_setItemState({ focusedItem, hoveredItem });
		}

		/*  Reactive helpers */

		const email = typeof _email !== 'string' ? '' : cleanValue(_email);
		const [username] = email.split('@');
		const isOpen = isTouched.current && suggestions.length > 0 && email.length >= minChars;

		/* Callbacks */

		const clearResults = useCallback(() => {
			setSuggestions([]);
			setItemState();
		}, []);

		/* Effects */

		useIsomorphicLayoutEffect(() => {
			if (!uniqueId.current) {
				uniqueId.current = getUniqueId();
			}
		}, []);

		useEffect(() => {
			if (itemState.focusedItem >= 0) {
				liRefs?.current[itemState.focusedItem]?.focus();
			}
		}, [itemState.focusedItem]);

		useEffect(() => {
			function handleOutsideClick(event: MouseEvent) {
				if (isOpen && !wrapperRef.current?.contains(event.target as Node)) {
					clearResults();
				}
			}

			if (!isOpen) {
				setItemState();
			}

			document.addEventListener('click', handleOutsideClick);

			return () => {
				document.removeEventListener('click', handleOutsideClick);
			};
		}, [isOpen, clearResults]);

		/* Event utils */

		function handleCursorFocus() {
			if (inputRef.current) {
				inputRef.current.setSelectionRange(email.length, email.length);
				inputRef.current.focus();
			}
		}

		/* Value handlers */

		function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
			isTouched.current = true;

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

		function dispatchSelect(
			value: OnSelectData['value'],
			keyboard: OnSelectData['keyboard'],
			position: OnSelectData['position']
		) {
			onSelect({ value, keyboard, position });
		}

		function handleSelect(
			event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>,
			itemIndex: number,
			isKeyboard: boolean
		) {
			event.preventDefault(), event.stopPropagation();
			const selectedEmail = cleanValue(event.currentTarget.textContent as string);
			setEmail(selectedEmail);
			clearResults();
			requestAnimationFrame(() => {
				dispatchSelect(selectedEmail, isKeyboard, itemIndex + 1);
			});
		}

		/* Keyboard events */

		function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
			if (isOpen) {
				switch (event.code) {
					case 'Tab':
					case 'Escape':
						event.stopPropagation();
						return clearResults();

					case 'ArrowDown':
						event.preventDefault(), event.stopPropagation();
						return setItemState(0, 0);
				}
			}
		}

		function handleListKeyDown(event: React.KeyboardEvent<HTMLLIElement>) {
			if (alphanumericKeys.test(event.key)) {
				event.stopPropagation();
				return inputRef?.current?.focus();
			}
			switch (event.code) {
				case 'Tab':
					event.stopPropagation();
					return clearResults();

				case 'Escape':
					event.preventDefault(), event.stopPropagation();
					clearResults();
					return handleCursorFocus();

				case 'Enter':
				case 'Space':
					event.preventDefault(), event.stopPropagation();
					return handleSelect(event, itemState.focusedItem, true);

				case 'Backspace':
				case 'ArrowLeft':
				case 'ArrowRight':
					event.stopPropagation();
					return inputRef?.current?.focus();

				case 'ArrowDown':
					event.preventDefault(), event.stopPropagation();
					if (itemState.focusedItem < suggestions.length - 1) {
						_setItemState((prevState) => ({
							hoveredItem: prevState.focusedItem + 1,
							focusedItem: prevState.focusedItem + 1
						}));
					}
					break;

				case 'ArrowUp':
					event.preventDefault(), event.stopPropagation();
					_setItemState((prevState) => ({
						hoveredItem: prevState.focusedItem - 1,
						focusedItem: prevState.focusedItem - 1
					}));
					if (itemState.focusedItem === 0) {
						inputRef?.current?.focus();
					}
					break;
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
				...(isFn(userOnFocus) ? { onFocus: (event) => handleExternal(event, userOnFocus!) } : {})
			};
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
			return { className: `${className || ''} ${classNames?.wrapper || ''}`.trim() || undefined };
		}

		function getClasses(elementName: Elements) {
			if (classNames?.[elementName]) {
				return {
					className: classNames[elementName]
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
			pattern
		};

		return (
			<div ref={wrapperRef} id={wrapperId} {...getWrapperClass()}>
				<input
					ref={(input) => mergeRefs(input as HTMLInputElement)}
					onChange={(event) => handleEmailChange(event)}
					aria-expanded={isOpen}
					value={email}
					type="text"
					role="combobox"
					autoComplete="off"
					aria-autocomplete="list"
					aria-invalid={isInvalid}
					{...getAriaControls()}
					{...getClasses(Elements.Input)}
					{...getEvents()}
					{...userAttrs}
				/>
				{isOpen && (
					<ul
						role="listbox"
						aria-label="List"
						ref={dropdownRef}
						id={listId}
						{...getClasses(Elements.Dropdown)}
					>
						{suggestions.map((domain, index) => (
							<li
								role="option"
								ref={(li) => (liRefs.current[index] = li)}
								onPointerMove={() => setItemState(undefined, index)}
								onMouseMove={() => setItemState(undefined, index)}
								onPointerLeave={() => setItemState()}
								onMouseLeave={() => setItemState()}
								onClick={(event) => handleSelect(event, index, false)}
								onKeyDown={handleListKeyDown}
								key={domain}
								aria-posinset={index + 1}
								aria-setsize={suggestions.length}
								aria-selected={index === itemState.focusedItem}
								data-active={index === itemState.hoveredItem}
								tabIndex={-1}
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
