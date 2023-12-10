import React, { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { cleanValue, getHonestValue, isFn, alphanumericKeys, getEmailData } from './utils'
import { Events, OnSelectData, Elements, Maybe, EmailProps } from './types'

/**
 * Controlled email input component.
 *
 * Read the documentation at: https://github.com/smastrom/react-email-autocomplete.
 */
export const Email = forwardRef<HTMLInputElement, EmailProps>(
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
         children,
         activeDataAttr,
         /* User events */
         onFocus: userOnFocus,
         onBlur: userOnBlur,
         onInput: userOnInput,
         onKeyDown: userOnKeyDown = () => {},
         /* ARIA */
         dropdownAriaLabel = 'Suggestions',
         /* HTML */
         ...inputAttrs
      }: EmailProps,
      externalRef
   ) => {
      /* User settings */

      const isRefineMode = refineList?.length > 0
      const maxResults = getHonestValue(_maxResults, 8, 6)
      const minChars = getHonestValue(_minChars, 8, 2)
      const baseList = _baseList.slice(0, maxResults)

      /* Refs */

      const isTouched = useRef(false)

      const listId = useId()

      const wrapperRef = useRef<Maybe<HTMLDivElement>>(null)
      const inputRef = useRef<Maybe<HTMLInputElement>>(null)
      const dropdownRef = useRef<Maybe<HTMLUListElement>>(null)
      const liRefs = useRef<Maybe<HTMLLIElement>[] | []>([])

      /* State */

      const [inputType, setInputType] = useState<'text' | 'email'>('email')
      const [suggestions, setSuggestions] = useState(baseList)

      /**
       * 'focusedIndex' is used to trigger suggestions focus
       * and can only be set by keyboard events.
       *
       * 'hoveredIndex' is used to keep track of both focused/hovered
       * suggestion in order to set 'data-active-email="true"'.
       *
       * When focusedIndex is set, hoveredIndex is set to the same value.
       * When hoveredIndex is set by pointer events, focusedIndex is set to -1.
       *
       * Keyboard handlers are able to set the new focus by 'resuming' from
       * any eventual 'hoveredIndex' triggered by pointer events and viceversa.
       */
      const [activeSuggestion, _setActiveSuggestion] = useState({
         focusedIndex: -1,
         hoveredIndex: -1,
      })

      function setActiveSuggestion(focusedIndex: number, hoveredIndex: number) {
         _setActiveSuggestion({ focusedIndex, hoveredIndex })
      }

      /**
       * Resumes keyboard focus from an eventual hovered suggestion.
       */
      function setActiveSuggestionFromHover({ isDecrement }: { isDecrement: boolean }) {
         const i = isDecrement ? -1 : 1

         _setActiveSuggestion((prevState) => ({
            hoveredIndex: prevState.hoveredIndex + i,
            focusedIndex: prevState.hoveredIndex + i,
         }))
      }

      /*  Reactive helpers */

      const email = typeof _email !== 'string' ? '' : cleanValue(_email)
      const [username] = email.split('@')

      /**
       * 'isOpen' conditionally renders the dropdown, we simply let the
       * results length decide if it should be mounted or not.
       */
      const isOpen = isTouched.current && suggestions.length > 0 && username.length >= minChars

      /* Callbacks */

      const clearResults = useCallback(() => {
         setSuggestions([])
         setActiveSuggestion(-1, -1)
      }, [])

      /* Effects */

      useEffect(() => {
         if (activeSuggestion.focusedIndex >= 0) {
            liRefs?.current[activeSuggestion.focusedIndex]?.focus()
         }
      }, [activeSuggestion.focusedIndex])

      useEffect(() => {
         function handleOutsideClick(e: MouseEvent) {
            if (isOpen && !wrapperRef.current?.contains(e.target as Node)) {
               clearResults()
            }
         }

         if (!isOpen) setActiveSuggestion(-1, -1)

         document.addEventListener('click', handleOutsideClick)

         return () => {
            document.removeEventListener('click', handleOutsideClick)
         }
      }, [isOpen, clearResults])

      /* Event utils */

      function handleCursorFocus() {
         if (inputRef.current) {
            flushSync(() => {
               setInputType('text')
            })

            inputRef.current.setSelectionRange(email.length, email.length)

            flushSync(() => {
               setInputType('email')
            })

            inputRef.current.focus()
         }
      }

      /* Value handlers */

      function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
         /**
          * On first mount/change, suggestions state is init with baseList.
          * As soon as the username is longer than minChars, the dropdown
          * is immediately mounted as such domains should be displayed
          * without any further condition by both modes.
          *
          * We also want the dropdown to be mounted exclusively
          * when users type so we set this ref to true.
          */
         isTouched.current = true

         const cleanEmail = cleanValue(e.target.value)
         const { hasUsername, hasAt, hasDomain, domain: _domain } = getEmailData(cleanEmail, minChars)

         if (hasUsername) {
            if (!isRefineMode) {
               hasAt ? clearResults() : setSuggestions(baseList)
            } else {
               if (hasDomain) {
                  const _suggestions = refineList
                     .filter((_suggestion) => _suggestion.startsWith(_domain))
                     .slice(0, maxResults)
                  if (_suggestions.length > 0) {
                     /**
                      * We also want to close the dropdown if users type exactly
                      * the same domain of the first/only suggestion.
                      *
                      * This will also unmount the dropdown after selecting a suggestion.
                      */
                     _suggestions[0] === _domain ? clearResults() : setSuggestions(_suggestions)
                  } else {
                     clearResults()
                  }
               } else {
                  setSuggestions(baseList)
               }
            }
         }

         setEmail(cleanEmail)
      }

      function dispatchSelect(
         value: OnSelectData['value'],
         keyboard: OnSelectData['keyboard'],
         position: OnSelectData['position']
      ) {
         onSelect({ value, keyboard, position })
      }

      function handleSelect(
         e: React.MouseEvent<HTMLLIElement | HTMLInputElement> | React.KeyboardEvent<HTMLLIElement | HTMLInputElement>,
         activeSuggestion: number,
         { isKeyboard, isInput }: { isKeyboard: boolean; isInput: boolean } = { isKeyboard: false, isInput: false }
      ) {
         e.preventDefault()
         e.stopPropagation()

         flushSync(() => {
            let selectedEmail = ''

            if (isInput) {
               selectedEmail = liRefs.current[activeSuggestion]?.textContent as string
            } else {
               selectedEmail = e.currentTarget.textContent as string
            }

            selectedEmail = cleanValue(selectedEmail)

            setEmail(selectedEmail)
            dispatchSelect(selectedEmail, isKeyboard, activeSuggestion + 1)
            clearResults()
         })

         inputRef.current?.focus()
      }

      /* Keyboard events */

      function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
         switch (e.code) {
            case 'Tab':
            case 'Escape':
               e.stopPropagation()
               return clearResults()

            /**
             * The conditions inside the following clauses allow the user to 'resume' and set the new focus
             * from an eventual hovered item.
             *
             * Since the input is focused when first hovering suggestions,
             * we must handle here the beginning of 'resume-from-hovered' logic here.
             */
            case 'ArrowUp':
               e.preventDefault()
               e.stopPropagation()

               if (activeSuggestion.hoveredIndex >= 0) setActiveSuggestionFromHover({ isDecrement: true })

               break

            case 'ArrowDown':
               e.preventDefault()
               e.stopPropagation()

               if (activeSuggestion.hoveredIndex >= 0) setActiveSuggestionFromHover({ isDecrement: false })
               if (activeSuggestion.hoveredIndex < 0) setActiveSuggestion(0, 0)

               break

            case 'Enter':
               e.preventDefault()
               e.stopPropagation()

               if (activeSuggestion.hoveredIndex >= 0)
                  handleSelect(e, activeSuggestion.hoveredIndex, {
                     isKeyboard: true,
                     isInput: true,
                  })

               break
         }
      }

      function handleListKeyDown(e: React.KeyboardEvent<HTMLLIElement>) {
         if (alphanumericKeys.test(e.key)) {
            e.stopPropagation()
            return inputRef?.current?.focus()
         }

         switch (e.code) {
            case 'Tab':
               e.stopPropagation()
               return clearResults()

            case 'Escape':
               e.preventDefault()
               e.stopPropagation()

               clearResults()
               return handleCursorFocus()

            case 'Enter':
            case 'Space':
               e.preventDefault()
               e.stopPropagation()

               return handleSelect(e, activeSuggestion.focusedIndex, {
                  isKeyboard: true,
                  isInput: false,
               })

            case 'Backspace':
            case 'ArrowLeft':
            case 'ArrowRight':
               e.stopPropagation()
               return inputRef?.current?.focus()

            /**
             * Same for the input handler, the conditions inside the
             * clauses allow users to set the new focus from
             * an eventual hovered item.
             *
             * Since we know that hoveredIndex is always set along with
             * focusedIndex, we are sure that the condition executes
             * also when no item was hovered using the pointer.
             */
            case 'ArrowUp':
               e.preventDefault()
               e.stopPropagation()

               setActiveSuggestionFromHover({ isDecrement: true })

               if (activeSuggestion.hoveredIndex === 0) inputRef?.current?.focus()

               break

            case 'ArrowDown':
               e.preventDefault()
               e.stopPropagation()

               if (activeSuggestion.hoveredIndex < suggestions.length - 1)
                  setActiveSuggestionFromHover({ isDecrement: false })
               if (activeSuggestion.hoveredIndex === suggestions.length - 1) setActiveSuggestion(0, 0)

               break
         }
      }

      /* User Events */

      /**
       * User's focus/blur should be triggered only when the related
       * target is not a suggestion, this will ensure proper behavior
       * with external input validation.
       */
      function handleExternal(
         e: React.FocusEvent<HTMLInputElement>,
         eventHandler: React.FocusEventHandler<HTMLInputElement>
      ) {
         const isInternal = liRefs.current.some((li) => li === e.relatedTarget)
         if (!isInternal || e.relatedTarget == null) eventHandler(e)
      }

      function getEvents(): Events {
         return {
            onKeyDown(e) {
               handleInputKeyDown(e)
               userOnKeyDown(e)
            },
            ...(isFn(userOnInput) ? { onInput: userOnInput } : {}),
            ...(isFn(userOnBlur) ? { onBlur: (e) => handleExternal(e, userOnBlur!) } : {}),
            ...(isFn(userOnFocus) ? { onFocus: (e) => handleExternal(e, userOnFocus!) } : {}),
         }
      }

      /* Props */

      function mergeRefs(inputElement: HTMLInputElement) {
         inputRef.current = inputElement
         if (externalRef) {
            // eslint-disable-next-line no-extra-semi
            ;(externalRef as React.MutableRefObject<Maybe<HTMLInputElement>>).current = inputElement
         }
      }

      function getWrapperClass() {
         return { className: `${className || ''} ${classNames?.wrapper || ''}`.trim() || undefined }
      }

      function getClasses(elementName: Elements) {
         if (classNames?.[elementName]) {
            return { className: classNames[elementName] }
         }
         return {}
      }

      return (
         <div ref={wrapperRef} {...getWrapperClass()}>
            <input
               {...inputAttrs}
               ref={(input) => mergeRefs(input as HTMLInputElement)}
               onChange={(e) => handleEmailChange(e)}
               aria-expanded={isOpen}
               value={email}
               type={inputType}
               role={suggestions.length > 0 ? 'combobox' : ''}
               autoComplete="off"
               aria-autocomplete="list"
               {...(isOpen ? { 'aria-controls': listId } : {})}
               {...getClasses(Elements.Input)}
               {...getEvents()}
            />
            {isOpen && (
               <ul
                  role="listbox"
                  aria-label={dropdownAriaLabel}
                  ref={dropdownRef}
                  id={listId}
                  {...getClasses(Elements.Dropdown)}
               >
                  {suggestions.map((domain, i) => (
                     <li
                        role="option"
                        ref={(li) => (liRefs.current[i] = li)}
                        onPointerMove={() => setActiveSuggestion(-1, i)}
                        onPointerLeave={() => setActiveSuggestion(-1, -1)}
                        onClick={(e) => handleSelect(e, i, { isKeyboard: false, isInput: false })}
                        onKeyDown={handleListKeyDown}
                        key={domain}
                        aria-posinset={i + 1}
                        aria-setsize={suggestions.length}
                        tabIndex={-1}
                        // This must always be false as no option can be already selected
                        aria-selected="false"
                        {...getClasses(Elements.Suggestion)}
                        {...{
                           [activeDataAttr ? activeDataAttr : 'data-active-email']: i === activeSuggestion.hoveredIndex,
                        }}
                     >
                        <span {...getClasses(Elements.Username)}>{username}</span>
                        <span {...getClasses(Elements.Domain)}>@{domain}</span>
                     </li>
                  ))}
               </ul>
            )}
            {children}
         </div>
      )
   }
)

Email.displayName = 'Email'
