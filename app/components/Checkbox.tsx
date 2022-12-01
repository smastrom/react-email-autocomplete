export type Options = {
	withRefine: boolean;
	customOnSelect: boolean;
	eventHandlers: boolean;
};

type CheckboxProps = {
	name: keyof Options;
	state: Options;
	setState: React.Dispatch<React.SetStateAction<Options>>;
	label: string;
};

export function Checkbox({ name, state, setState, label }: CheckboxProps) {
	return (
		<div className="checkboxWrapper">
			<input
				className="checkboxInput"
				type="checkbox"
				id={name}
				onChange={() =>
					setState((prevOptions) => ({
						...prevOptions,
						[name]: !prevOptions[name],
					}))
				}
				checked={state[name]}
			/>
			<label htmlFor={name} className="checkboxLabel">
				{label}
			</label>
		</div>
	);
}
