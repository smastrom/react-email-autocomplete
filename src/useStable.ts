import { useEffect, useRef } from 'react';

export function useStable<T>(value: T): T {
	const stableValue = useRef<T>();

	useEffect(() => {
		stableValue.current = value;
	}, [value]);

	return stableValue.current as T;
}
