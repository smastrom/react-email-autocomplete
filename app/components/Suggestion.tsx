import React from 'react';

type Props = {
	isActive: boolean;
	value: string | undefined;
	confirmCallback: () => void;
};

export function Suggestion({ isActive, value, confirmCallback }: Props) {
	if (!isActive) {
		return null;
	}

	if (!value) {
		return null;
	}
	return (
		<div aria-live="assertive" aria-atomic="true" aria-relevant="additions" className="suggestion">
			{value && (
				<>
					Did you mean{' '}
					<button type="button" onClick={confirmCallback}>
						{value}
					</button>
					?<p className="visuallyHidden">Click the button to confirm the correction.</p>
				</>
			)}
		</div>
	);
}
