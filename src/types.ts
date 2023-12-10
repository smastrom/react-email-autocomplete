import * as React from 'react'

export type Maybe<T> = T | null

export enum Elements {
   Wrapper = 'wrapper',
   Input = 'input',
   Dropdown = 'dropdown',
   Suggestion = 'suggestion',
   Username = 'username',
   Domain = 'domain',
}

export type ClassNames = Partial<Record<Elements, string>>

export type OnSelectData = {
   value: string
   keyboard: boolean
   position: number
}

export type Values = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type OnChange = React.Dispatch<React.SetStateAction<string>> | ((newValue: string) => void | Promise<void>)
export type OnSelect = (object: OnSelectData) => void | Promise<void>

export type Props = {
   /** State or portion of state to hold the email. */
   value: string | undefined
   /** State setter or custom dispatcher to update the email. */
   onChange: OnChange
   /** Domains to suggest while typing the username. */
   baseList: string[]
   /** Domains to refine suggestions after typing @. */
   refineList?: string[]
   /** Custom callback to invoke on suggestion select. */
   onSelect?: OnSelect
   /** Minimum chars required to display suggestions. */
   minChars?: Values
   /** Maximum number of suggestions to display. */
   maxResults?: Omit<Values, 1>
   /** Class names for each element. */
   classNames?: ClassNames
   /** Class name of the wrapper element. */
   className?: string
   /** Dropdown `aria-label` value */
   dropdownAriaLabel?: string
   /** Value of the `data-` attribute to be set on the focuesed/hovered suggestion. Defaults to `data-active-email`. */
   activeDataAttr?: `data-${string}`
   children?: React.ReactNode
   /** Dropdown placement.
    *
    * @deprecated Since version 1.0.0 dropdown is always placed below the input.
    */
   placement?: 'auto' | 'bottom'
   /** Custom prefix for dropdown unique ID.
    *
    * @deprecated Since version 1.1.0 it is generated automatically.
    */
   customPrefix?: string
   /** DOM ID of the wrapper element.
    *
    * @deprecated Since version 1.1.0
    */
   wrapperId?: string
   /** Input field validity state for assistive technologies.
    *
    * @deprecated Since version 1.1.0. Use `aria-invalid` instead.
    */
   isInvalid?: boolean
}

export type Events = {
   onFocus?: React.FocusEventHandler<HTMLInputElement>
   onBlur?: React.FocusEventHandler<HTMLInputElement>
   onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
   onInput?: React.FormEventHandler<HTMLInputElement>
}

export type InternalInputProps =
   | 'ref'
   | 'aria-expanded'
   | 'type'
   | 'role'
   | 'autoComplete'
   | 'aria-autocomplete'
   | 'aria-controls'

export type EmailProps = Props &
   Events &
   Partial<Omit<React.HTMLProps<HTMLInputElement>, keyof Props | keyof Events | InternalInputProps>>

export type LocalizedList = {
   default: string[]
} & Record<string, string[]>
