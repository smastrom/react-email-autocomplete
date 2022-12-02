type Props = {
	isError: boolean;
	isValid: boolean;
};

export function ValidityIcon({ isError, isValid }: Props) {
	if (isValid) {
		return (
			<svg
				aria-hidden="true"
				className="checkmark"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d={`M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858
16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z`}
				/>
			</svg>
		);
	}

	if (isError) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				className="alert"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="8" x2="12" y2="12"></line>
				<line x1="12" y1="16" x2="12.01" y2="16"></line>
			</svg>
		);
	}

	return null;
}
