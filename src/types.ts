export type Maybe<T> = T | undefined;

export type CustomClasses = {
	wrapperClassName?: string;
	inputClassName?: string;
	dropdownClassName?: string;
	suggestionClassName?: string;
	usernameClassName?: string;
	domainClassName?: string;
};

export type Props = {
	value: Maybe<string>;
	onChange: (value: string) => void;
	baseList: string[];
	domainList?: string[];
	defaultValue?: string;
	animation?: string;
	classNames?: CustomClasses;
	className?: string;
	scrollIntoView?: boolean;
	closeOnScroll?: boolean;
	startAfter?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	maxSuggestions?: 2 | 3 | 4 | 5 | 6 | 7 | 8;
	nextElement?: string;
};

export type Events = {
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	onInput?: React.FormEventHandler<HTMLInputElement>;
};

export type Attributes = {
	id?: string;
	placeholder?: string;
};

export type SelectionIndex = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
