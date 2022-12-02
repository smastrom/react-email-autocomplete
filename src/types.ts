import React from 'react';

export type Maybe<T> = T | null;

export enum ClassProps {
	Wrapper = 'wrapper',
	Input = 'input',
	Dropdown = 'dropdown',
	Suggestion = 'suggestion',
	Username = 'username',
	Domain = 'domain',
}

export type ClassNames = Partial<Record<ClassProps, string>>;

export type SelectData = {
	value: string;
	keyboard: boolean;
	position: number;
};

export type Values = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Change =
	| React.Dispatch<React.SetStateAction<string>>
	| ((value: string) => void | Promise<void>);

export type Select = (object: SelectData) => void | Promise<void>;

export type Props = {
	/** State or portion of state to hold the email. */
	value: string | undefined;
	/** State setter or custom dispatcher to update the email. */
	onChange: Change;
	/** Domains to suggest while typing the username. */
	baseList: string[];
	/** Domains to refine suggestions after typing @. */
	refineList?: string[];
	/** Custom callback to invoke on suggestion select. */
	onSelect?: Select;
	/** Minimum chars required to display suggestions. */
	minChars?: Values;
	/** Maximum number of suggestions to display. */
	maxResults?: Omit<Values, 1>;
	/** Class names of each child. */
	classNames?: ClassNames;
	/** Class name of the wrapper element. */
	className?: string;
	/** DOM ID of the next focusable element. If set, it will
	 * be focused after a suggestion is selected. */
	nextElement?: string;
	/** Custom prefix for dropdown unique ID. */
	customPrefix?: string;
	children?: React.ReactNode;
};

export type Events = {
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	onInput?: React.FormEventHandler<HTMLInputElement>;
};

export type Attributes = Partial<
	Pick<HTMLInputElement, 'id' | 'placeholder' | 'name' | 'readOnly' | 'required' | 'disabled'>
>;

export type EmailProps = Props & Events & Attributes;

export declare const Email: React.ForwardRefExoticComponent<
	EmailProps & React.RefAttributes<HTMLInputElement>
>;
