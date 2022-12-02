export type Options = {
	withRefine: boolean;
	customOnSelect: boolean;
	eventHandlers: boolean;
};

type CheckboxProps = {
	name: keyof Options;
	checked: boolean;
	label: string;
	onChange: (value: keyof Options) => void;
};

export function Checkbox({ name, checked, label, onChange }: CheckboxProps) {
	return (
		<div className="checkboxWrapper">
			<input
				className="checkboxInput"
				type="checkbox"
				id={name}
				onChange={() => onChange(name)}
				checked={checked}
			/>
			<label htmlFor={name} className="checkboxLabel">
				{label}
			</label>
		</div>
	);
}
