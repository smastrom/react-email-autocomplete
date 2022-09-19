export type Maybe<T> = T | undefined;

export type ClassNames = {
	wrapper?: string;
	input?: string;
	dropdown?: string;
	suggestion?: string;
	username?: string;
	domain?: string;
};

export type SelectPar = {
	valueSelected: string;
	withKeyboard: boolean;
	position: number;
	target: HTMLLIElement;
};

export type Props = {
	value: Maybe<string>;
	onChange:
		| React.Dispatch<React.SetStateAction<string>>
		| ((value: string) => void | Promise<void>);
	onSelect?: (object: SelectPar) => void | Promise<void>;
	baseList: string[];
	domainList?: string[];
	animation?: string;
	classNames?: ClassNames;
	className?: string;
	closeOnScroll?: number | null;
	startAfter?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	maxSuggestions?: 2 | 3 | 4 | 5 | 6 | 7 | 8;
	nextElement?: string;
	listPrefix?: string;
};

export type Events = {
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	onInput?: React.FormEventHandler<HTMLInputElement>;
};

export type Attributes = {
	id?: HTMLInputElement['id'];
	placeholder?: HTMLInputElement['placeholder'];
	defaultValue?: HTMLInputElement['defaultValue'];
	name?: HTMLInputElement['name'];
	minLength?: HTMLInputElement['minLength'];
	maxLength?: HTMLInputElement['maxLength'];
	pattern?: HTMLInputElement['pattern'];
	readOnly?: HTMLInputElement['readOnly'];
	required?: HTMLInputElement['required'];
};

export type SelectionIndex = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
