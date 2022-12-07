import {
	Dispatch,
	SetStateAction,
	FocusEventHandler,
	KeyboardEventHandler,
	RefAttributes,
	ForwardRefExoticComponent,
	FormEventHandler,
	ReactNode
} from 'react';

export type Maybe<T> = T | null;

export enum Elements {
	Wrapper = 'wrapper',
	Input = 'input',
	Dropdown = 'dropdown',
	Suggestion = 'suggestion',
	Username = 'username',
	Domain = 'domain'
}

export type ClassNames = Partial<Record<Elements, string>>;

export type OnSelectData = {
	value: string;
	keyboard: boolean;
	position: number;
};

export type Values = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type OnChange =
	| Dispatch<SetStateAction<string>>
	| ((newValue: string) => void | Promise<void>);
export type OnSelect = (object: OnSelectData) => void | Promise<void>;

export type Props = {
	/** State or portion of state to hold the email. */
	value: string | undefined;
	/** State setter or custom dispatcher to update the email. */
	onChange: OnChange;
	/** Domains to suggest while typing the username. */
	baseList: string[];
	/** Domains to refine suggestions after typing @. */
	refineList?: string[];
	/** Custom callback to invoke on suggestion select. */
	onSelect?: OnSelect;
	/** Minimum chars required to display suggestions. */
	minChars?: Values;
	/** Maximum number of suggestions to display. */
	maxResults?: Omit<Values, 1>;
	/** Class names for each element. */
	classNames?: ClassNames;
	/** Class name of the wrapper element. */
	className?: string;
	/** Custom prefix for dropdown unique ID. */
	customPrefix?: string;
	/** DOM ID of the wrapper element. */
	wrapperId?: string;
	/** Validity state of the field for assistive technologies. */
	isInvalid?: boolean;
	children?: ReactNode;
};

export type Events = {
	onFocus?: FocusEventHandler<HTMLInputElement>;
	onBlur?: FocusEventHandler<HTMLInputElement>;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	onInput?: FormEventHandler<HTMLInputElement>;
};

export type Attributes = Partial<
	Pick<
		HTMLInputElement,
		'id' | 'placeholder' | 'name' | 'readOnly' | 'required' | 'disabled' | 'pattern'
	>
>;

export type EmailProps = Props & Events & Attributes;

export type LocalizedList = {
	default: string[];
} & Record<string, string[]>;

/** Controlled email input component.
 * Read the documentation at: https://github.com/smastrom/react-bella-email. */
export declare const Email: ForwardRefExoticComponent<EmailProps & RefAttributes<HTMLInputElement>>;

/** List of ~160 world's most popular email providers.
 * Meant to be used with `refineList` prop. */
export declare const domains: string[];

/** Hook to automatically inject localized lists according to user's browser locale.
 * Read the documentation at: https://github.com/smastrom/react-bella-email. */
export declare function useLocalizedList(lists: LocalizedList, appLocale?: string): string[];
