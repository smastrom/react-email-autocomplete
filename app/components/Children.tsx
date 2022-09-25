import React from 'react';

type Props = {
	isActive: boolean;
	isError: boolean;
	isValid: boolean;
};

export function Children({ isActive = false, isError, isValid }: Props) {
	if (!isActive) {
		return null;
	}

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
				className="checkmark alert"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
				<line x1="15" y1="9" x2="9" y2="15" />
				<line x1="9" y1="9" x2="15" y2="15" />
			</svg>
		);
	}

	return null;
}
