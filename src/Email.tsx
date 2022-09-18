import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	cleanValue,
	getUniqueId,
	getHonestValue,
	isInvalid,
	isValidArr,
	isNotDesktop,
} from './utils';

import type { Attributes, Props, Events, ClassNames, SelectionIndex } from './types';

enum KeyboardState {
	Locked = 'LOCKED',
	Unlocked = 'UNLOCKED',
	Granted = 'GRANTED',
}

export const Email = forwardRef<HTMLInputElement, Attributes & Props & Events>(
	(
		{
			/* Core - Required */
			onChange: updateValue,
			value: externalValue,
			baseList,
			/* Core - Optional */
			domainList = [],
			animation,
			scrollIntoView = true,
			maxSuggestions = 6,
			startAfter = 2,
			nextElement,
			closeOnScroll = false,
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

		const wrapperRef = useRef<HTMLDivElement | null>(null);
		const spanRef = useRef<HTMLSpanElement | null>(null);
		const inputRef = useRef<HTMLInputElement | null>(null);
		const liRefs = useRef<(HTMLLIElement | null)[] | []>([]);

		const selectionIndex = useRef<SelectionIndex>(-1);

		const skipInitial = useRef(true);

		const listId = useRef<string | undefined>(getUniqueId());

		/* State */

		const [internalDomains, setInternalDomains] = useState(baseList);
		const [isOpen, setIsOpen] = useState(false);

		const [isAllowedToType, setIsAllowedToType] = useState<KeyboardState>(KeyboardState.Unlocked);

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

		const shouldScrollIntoView = scrollIntoView && isNotDesktop();

		/* Effects */

		function resetState() {
			setInternalDomains([]);
			setIsOpen(false);
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

		/* UI Effects */

		useEffect(() => {
			function handleClose(event: MouseEvent) {
				if (isOpen) {
					if (!wrapperRef.current?.contains(event.target as Node)) {
						setIsOpen(false);
					}
				}
			}

			document.addEventListener('click', handleClose);

			return () => {
				document.removeEventListener('click', handleClose);
			};
		}, [isOpen]);

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

				if (Math.abs(endY - startY) >= 150) {
					console.log('Closing on scroll!');
					resetState();
					document.removeEventListener('scroll', scrollClose);
				}
			}

			if (isOpen) {
				document.addEventListener('scroll', scrollClose, { passive: true });
			} else {
				document.removeEventListener('scroll', scrollClose);
			}
		}, [isOpen]);

		useEffect(() => {
			if (closeOnScroll) {
				handleScrollClose();
			}
		}, [closeOnScroll, handleScrollClose]);

		const handleScrollIntoView = useCallback(() => {
			let timeoutID: NodeJS.Timeout;

			function scrollIntoView() {
				clearTimeout(timeoutID);
				timeoutID = setTimeout(() => {
					// console.log('scrollIntoView callBack - Scroll ended!');
					setIsAllowedToType(KeyboardState.Granted);
				}, 100);
			}

			if (isAllowedToType === KeyboardState.Locked) {
				// console.log('scrollIntoView - Adding Listener!');
				document.addEventListener('scroll', scrollIntoView, { passive: true });
			} else if (isAllowedToType === KeyboardState.Granted) {
				// console.log('scrollIntoView - Removing Listener!');
				document.removeEventListener('scroll', scrollIntoView);
			}
		}, [isAllowedToType]);

		useEffect(() => {
			if (shouldScrollIntoView) {
				handleScrollIntoView();
			}
		}, [shouldScrollIntoView, handleScrollIntoView]);

		// const scrollIntoViewOnce = useRef(false);

		function triggerScrollIntoView() {
			const yPos = inputRef?.current?.getBoundingClientRect().y as number;
			const height = inputRef?.current?.scrollHeight as number;

			/* Is Necessary? */

			if (yPos >= height * 2) {
				const bodyYPos = document.body.getBoundingClientRect().y;
				setIsAllowedToType(KeyboardState.Locked);
				scrollTo({
					top: yPos - bodyYPos - height,
					left: 0,
					behavior: 'smooth',
				});
			}
		}

		/* Prevent rendering */

		if ((typeof externalValue !== 'string' && !baseList) || typeof updateValue !== 'function') {
			return null;
		}

		/* Handlers */

		function setCursor() {
			if (inputRef.current) {
				inputRef.current.type = 'text';
				inputRef.current.setSelectionRange(absoluteValue.length, absoluteValue.length);
				inputRef.current.type = 'email';
			}
		}

		function handleInternalChange(event: React.ChangeEvent<HTMLInputElement>) {
			updateValue(cleanValue(event.target.value));
		}

		function handleInputKeyboard(event: React.KeyboardEvent<HTMLInputElement>) {
			if (shouldScrollIntoView && isAllowedToType === KeyboardState.Locked) {
				return event.preventDefault();
			}
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
			resetState();
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
						if (selectionIndex.current < internalDomains.length - 1) {
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

		function setEvents() {
			const events: Partial<Events> = {};

			events.onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
				handleInputKeyboard(event);
				if (typeof userOnKeyDown === 'function') {
					userOnKeyDown(event);
				}
			};

			events.onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
				if (shouldScrollIntoView) {
					triggerScrollIntoView();
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
			defaultValue,
			minLength,
			maxLength,
			pattern,
			readOnly,
			required,
		};

		function pushRefs(inputElement: HTMLInputElement) {
			inputRef.current = inputElement;
			if (externalRef) {
				(externalRef as React.MutableRefObject<HTMLInputElement | null>).current = inputElement;
			}
		}

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

		function setWrapperClass() {
			const classes = `${className || ''} ${classNames?.wrapper || ''}`.trim();

			if (classes.length > 0) {
				return { className: classes };
			}
			return {};
		}

		function setClasses(classProperty: keyof ClassNames) {
			if (typeof classNames !== 'undefined' && typeof classNames[classProperty] === 'string') {
				return { className: classNames[classProperty] };
			}
			return {};
		}

		function setPrefix() {
			const prefix = typeof listPrefix === 'string' ? `${listPrefix}_` : 'react-ems_';
			return `${prefix}${listId.current}`;
		}

		return (
			<div ref={wrapperRef} {...setWrapperClass()}>
				{scrollIntoView && (
					<span ref={spanRef} aria-hidden="true" style={{ top: '-1.5em', position: 'absolute' }} />
				)}

				<input
					ref={(thisElement) => pushRefs(thisElement as HTMLInputElement)}
					type="email"
					autoComplete="off"
					aria-autocomplete="list"
					role="combobox"
					aria-expanded={isOpen}
					aria-controls={setPrefix()}
					onChange={(event) => handleInternalChange(event)}
					value={absoluteValue}
					{...setClasses('input')}
					{...setEvents()}
					{...userAttrs}
				/>

				<ul id={setPrefix()} {...getListStyles()} {...setClasses('dropdown')}>
					{isOpen &&
						internalDomains.map((domain, index) => (
							<li
								key={domain}
								ref={(thisElement) => (liRefs.current[index] = thisElement)}
								role="option"
								aria-posinset={index + 1}
								aria-setsize={internalDomains.length}
								aria-selected={index === selectionIndex.current}
								tabIndex={0}
								onKeyDown={handleListKeyboard}
								onClick={(event) => handleSuggestionClick(event)}
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
