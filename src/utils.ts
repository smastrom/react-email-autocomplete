import { useLayoutEffect, useEffect } from 'react';

export const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const alphanumericKeys = /^[a-z0-9]$/i;

export function cleanValue(value: string) {
	return value.replace(/\s+/g, '').toLowerCase();
}

export function getUniqueId() {
	return (Math.random() + 1).toString(36).substring(7);
}

export function getHonestValue(value: unknown, maxValue: number, defaultValue: number) {
	if (typeof value === 'number' && Number.isInteger(value) && value <= maxValue) {
		return value;
	}
	return defaultValue;
}

export function isFn(fn: unknown) {
	return typeof fn === 'function';
}

export function getEmailData(value: string, minChars: number) {
	const [_username] = value.split('@');
	const breakpoint = value.indexOf('@');
	const _domain = breakpoint >= 0 ? value.slice(breakpoint + 1) : '';

	const hasUsername = _username.length >= minChars;
	const hasAt = hasUsername && value.includes('@');
	const hasDomain = hasUsername && _domain.length >= 1; // Domain is truthy only if typed @

	return { _username, _domain, hasUsername, hasAt, hasDomain };
}
