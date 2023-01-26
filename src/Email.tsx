import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import {
	cleanValue,
	getUniqueId,
	getHonestValue,
	isFn,
	useIsomorphicLayoutEffect,
	alphanumericKeys,
	getEmailData,
	getScrollElement,
	usePrevious
} from './utils';
import {
	Events,
	OnSelectData,
	Elements,
	Maybe,
	Email as Export,
	EmailProps,
	Placement
} from './types';

export const Email: typeof Export = forwardRef<HTMLInputElement, EmailProps>(
	(
		{
			/* Core - Required */
			onChange: setEmail,
			value: _email,
			baseList: _baseList,
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
			placement: _placement = 'auto',
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

		const isRefineMode = refineList?.length > 0;
		const maxResults = getHonestValue(_maxResults, 8, 6);
		const minChars = getHonestValue(_minChars, 8, 2);
		const baseList = _baseList.slice(0, maxResults);
		const isAutoPlacement = _placement === 'auto';

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
		const [placement, setPlacement] = useState<Placement>(Placement.Initial);
		const prevPlacement = usePrevious(placement);

		/**
		 * 'focusedIndex' is used to trigger suggestions focus and set
		 * 'aria-selected' to 'true', it can only be set by keyboard events.
		 * 'hoveredIndex' is used to keep track of both focused/hovered
		 * suggestion in order to set 'data-active-email="true"'.
		 *
		 * When focusedIndex is set, hoveredIndex is set to the same value.
		 * When hoveredIndex is set by pointer events, focusedIndex is set to -1.
		 *
		 * Keyboard handlers are able to set the new focus by 'resuming' from
		 * any eventual 'hoveredIndex' triggered by pointer events and viceversa.
		 */
		const [itemState, _setItemState] = useState({
			focusedIndex: -1,
			hoveredIndex: -1
		});

		function setItemState(focusedIndex = -1, hoveredIndex = -1) {
			_setItemState({ focusedIndex, hoveredIndex });
		}

		/**
		 * This function 'resumes' focusing from an eventual hovered suggestion.
		 * Index ordering doesn't mutate with placement.
		 */
		function setFromHovered({ isDecrement }: { isDecrement: boolean }) {
			const index = isDecrement ? -1 : 1;

			_setItemState((prevState) => ({
				hoveredIndex: prevState.hoveredIndex + index,
				focusedIndex: prevState.hoveredIndex + index
			}));
		}

		/*  Reactive helpers */

		const email = typeof _email !== 'string' ? '' : cleanValue(_email);
		const [username] = email.split('@');

		/**
		 * 'isOpen' conditionally renders the dropdown, we simply let the
		 * results length decide if it should be mounted or not.
		 */
		const isOpen = isTouched.current && suggestions.length > 0 && username.length >= minChars;

		/* Callbacks */

		const clearResults = useCallback(() => {
			setSuggestions([]);
			setItemState();
		}, []);

		useEffect(() => {
			console.log(placement);
		}, [placement]);

		/* Effects */

		useIsomorphicLayoutEffect(() => {
			if (!uniqueId.current) {
				uniqueId.current = getUniqueId();
			}
		}, []);

		// We want to trigger below fn as soon as isOpen is true, then on scroll or resize
		const triggerBeforeOpen = useRef(true);

		// This moves the dropdown to the top if it's overflowing the viewport
		useIsomorphicLayoutEffect(() => {
			function _setDropdownPlacement() {
				if (inputRef.current && dropdownRef.current && scrollElement) {
					const availableVH = window.visualViewport?.height || 0;

					const { bottom: scrollBottom } = scrollElement.getBoundingClientRect();
					const { height: dropdownHeight } = dropdownRef.current.getBoundingClientRect();
					const { bottom: inputBottom, height: inputHeight } =
						inputRef.current.getBoundingClientRect();

					// Use bottom as main condition, as soon there's space, place it there
					const isPlacementBottom =
						(isWindowScroll ? availableVH : scrollBottom) - inputBottom >= dropdownHeight;

					dropdownRef.current.style.removeProperty('top');

					if (isPlacementBottom) {
						setPlacement(Placement.Bottom);
						dropdownRef.current.style.removeProperty('bottom');
					} else {
						setPlacement(Placement.Top);
						dropdownRef.current.style.bottom = `${inputHeight ?? 0}px`;
					}

					triggerBeforeOpen.current = false;
				}
			}

			const scrollElement = getScrollElement(inputRef.current as HTMLElement);
			const isWindowScroll = scrollElement === document.documentElement;
			const scrollListener = isWindowScroll ? document : scrollElement;

			const setDropdownPlacement = isAutoPlacement ? _setDropdownPlacement : () => {};

			if (isOpen) {
				if (triggerBeforeOpen.current) {
					if (!isAutoPlacement) {
						triggerBeforeOpen.current = false;
						return setPlacement(Placement.Bottom);
					}
					setDropdownPlacement();
				}
				scrollListener?.addEventListener('scroll', setDropdownPlacement, { passive: true });
				window.addEventListener('resize', setDropdownPlacement, { passive: true });
			} else {
				triggerBeforeOpen.current = true;
			}

			return () => {
				scrollListener?.removeEventListener('scroll', setDropdownPlacement);
				window.removeEventListener('resize', setDropdownPlacement);
			};
		}, [isOpen, isAutoPlacement]);

		useIsomorphicLayoutEffect(() => {
			// Prevent first and useless re-renders
			if (isAutoPlacement && prevPlacement !== undefined && prevPlacement !== placement) {
				if (prevPlacement === Placement.Initial) {
					if (placement === Placement.Top) {
						return setSuggestions((prevSugg) => [...prevSugg.reverse()]);
					}
					return; // Return if initial placement is bottom
				}

				return setSuggestions((prevSugg) => [...prevSugg.reverse()]); // From now on reverse when position changes
			}
		}, [placement, prevPlacement, isAutoPlacement]);

		useEffect(() => {
			if (itemState.focusedIndex >= 0) {
				liRefs?.current[itemState.focusedIndex]?.focus();
			}
		}, [itemState.focusedIndex]);

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
			/**
			 * On first mount/change, suggestions state is init with baseList.
			 * As soon as the username is longer than minChars, the dropdown
			 * is immediately mounted as such domains should be displayed
			 * without any further condition by both modes.
			 *
			 * We also want the dropdown to be mounted exclusively
			 * when users type so we set this ref to true.
			 */
			isTouched.current = true;

			const cleanEmail = cleanValue(event.target.value);
			const { hasUsername, hasAt, hasDomain, domain: _domain } = getEmailData(cleanEmail, minChars);

			if (hasUsername) {
				if (!isRefineMode) {
					hasAt ? clearResults() : setSuggestions(baseList);
				} else {
					if (hasDomain) {
						const _suggestions = refineList
							.filter((_suggestion) => _suggestion.startsWith(_domain))
							.slice(0, maxResults);
						if (_suggestions.length > 0) {
							/**
							 * We also want to close the dropdown if users type exactly
							 * the same domain of the first/only suggestion.
							 *
							 * This will also unmount the dropdown after selecting a suggestion.
							 */
							_suggestions[0] === _domain ? clearResults() : setSuggestions(_suggestions);
						} else {
							clearResults();
						}
					} else {
						setSuggestions(baseList);
					}
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
			switch (event.code) {
				case 'Tab':
				case 'Escape':
					event.stopPropagation();
					return clearResults();

				/**
				 * The conditions inside the following clauses
				 * allow the user to 'resume' and set the new focus
				 * from an eventual hovered item.
				 */
				case 'ArrowUp':
					event.preventDefault(), event.stopPropagation();

					if (itemState.hoveredIndex >= 0) {
						setFromHovered({ isDecrement: true });
					}

					if (placement === Placement.Top && itemState.hoveredIndex < 0) {
						setItemState(suggestions.length - 1, suggestions.length - 1); // Top placement specific
					}
					break;

				case 'ArrowDown':
					event.preventDefault(), event.stopPropagation();

					if (itemState.hoveredIndex >= 0) {
						setFromHovered({ isDecrement: false });
					}

					if (itemState.hoveredIndex < 0) {
						/**
						 * Focus always the first regardless of placement
						 * This will give consistency for visually impaired users.
						 */
						setItemState(0, 0);
					}
					break;
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
					return handleSelect(event, itemState.focusedIndex, true);

				case 'Backspace':
				case 'ArrowLeft':
				case 'ArrowRight':
					event.stopPropagation();
					return inputRef?.current?.focus();

				/**
				 * Same for the input handler, the conditions inside the
				 * clauses allow users to set the new focus from
				 * an eventual hovered item.
				 *
				 * Since we know that hoveredIndex is always set along with
				 * focusedIndex, we are sure that the condition executes
				 * also when no item was hovered.
				 */
				case 'ArrowUp':
					event.preventDefault(), event.stopPropagation();

					if (placement === Placement.Top && itemState.hoveredIndex === 0) {
						return;
					}

					setFromHovered({ isDecrement: true });

					if (placement === Placement.Bottom && itemState.hoveredIndex === 0) {
						inputRef?.current?.focus();
					}
					break;

				case 'ArrowDown':
					event.preventDefault(), event.stopPropagation();

					if (itemState.hoveredIndex < suggestions.length - 1) {
						setFromHovered({ isDecrement: false });
					}

					if (placement === Placement.Top && itemState.hoveredIndex === suggestions.length - 1) {
						setItemState(-1, -1);
						inputRef?.current?.focus();
					}
					break;
			}
		}

		/* User Events */

		/**
		 * User's focus/blur should be triggered only when the related
		 * target is not a suggestion, this will ensure proper behavior
		 * with external input validation.
		 */
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
					{...(isOpen ? { 'aria-controls': listId } : {})}
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
								onPointerMove={() => setItemState(-1, index)}
								onMouseMove={() => setItemState(-1, index)}
								onPointerLeave={() => setItemState()}
								onMouseLeave={() => setItemState()}
								onClick={(event) => handleSelect(event, index, false)}
								onKeyDown={handleListKeyDown}
								key={domain}
								aria-posinset={index + 1}
								aria-setsize={suggestions.length}
								aria-selected={index === itemState.focusedIndex}
								data-active-email={index === itemState.hoveredIndex}
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
