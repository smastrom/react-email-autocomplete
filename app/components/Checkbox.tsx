type CheckboxProps<T extends Record<string, boolean>> = {
	name: keyof T;
	checked: boolean;
	label: string;
	onChange: (value: keyof T) => void;
};

export function Checkbox<T extends Record<string, boolean>>({
	name,
	checked,
	label,
	onChange,
}: CheckboxProps<T>) {
	return (
		<div className="checkboxWrapper">
			<input
				className="checkboxInput"
				type="checkbox"
				id={name as string}
				onChange={() => onChange(name)}
				checked={checked}
			/>
			<label htmlFor={name as string} className="checkboxLabel">
				{label}
			</label>
		</div>
	);
}
