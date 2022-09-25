export type Options = {
	withRefine: boolean;
	customOnSelect: boolean;
	eventHandlers: boolean;
	useSuggestion: boolean;
	withChildren: boolean;
};

type CheckboxProps = {
	optionProp: keyof Options;
	state: Options;
	setState: React.Dispatch<React.SetStateAction<Options>>;
	label: string;
};

export function Checkbox({ optionProp, state, setState, label }: CheckboxProps) {
	return (
		<div className="checkboxWrapper">
			<input
				className="checkboxInput"
				type="checkbox"
				id={optionProp}
				checked={state[optionProp]}
				onChange={() =>
					setState((prevOptions) => ({
						...prevOptions,
						[optionProp]: !prevOptions[optionProp],
					}))
				}
			/>
			<label htmlFor={optionProp} className="checkboxLabel">
				{label}
			</label>
		</div>
	);
}
