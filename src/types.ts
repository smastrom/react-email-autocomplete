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
	valueSelected: string;
	withKeyboard: boolean;
	position: number;
};

type Values = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Props = {
	value: string | undefined;
	onChange:
		| React.Dispatch<React.SetStateAction<string>>
		| ((value: string) => void | Promise<void>);
	onSelect?: (object: SelectData) => void | Promise<void>;
	baseList: string[];
	domainList?: string[];
	animation?: string;
	classNames?: ClassNames;
	className?: string;
	closeOnScroll?: number | null;
	startAfter?: Values;
	maxSuggestions?: Omit<Values, 1>;
	nextElement?: string;
	children?: React.ReactNode;
};

export type Events = {
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	onInput?: React.FormEventHandler<HTMLInputElement>;
};

export type Attributes = Partial<
	Pick<
		HTMLInputElement,
		'id' | 'placeholder' | 'name' | 'minLength' | 'maxLength' | 'pattern' | 'readOnly' | 'required'
	>
>;

export type SelectionIndex = -1 | Omit<Values, 8>;
