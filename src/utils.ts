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
	const [username] = value.split('@');
	const breakpoint = value.indexOf('@');
	const domain = breakpoint >= 0 ? value.slice(breakpoint + 1) : '';

	const hasUsername = username.length >= minChars;
	const hasAt = hasUsername && value.includes('@');
	const hasDomain = hasUsername && domain.length >= 1; // Domain is truthy only if typed @

	return { username, domain, hasUsername, hasAt, hasDomain };
}

if (import.meta.vitest) {
	const { it, expect, describe } = import.meta.vitest;

	describe('Domain', () => {
		it('Should return domain', () => {
			const { domain } = getEmailData('username@gmail.com', 2);
			expect(domain).toBe('gmail.com');

			const { domain: domain2 } = getEmailData('username@g', 2);
			expect(domain2).toBe('g');
		});

		it('Should return domain even if more @', () => {
			const { domain } = getEmailData('username@ciao@', 2);
			expect(domain).toBe('ciao@');
		});

		it('Should return empty string if no domain', () => {
			const { domain } = getEmailData('username@', 2);
			expect(domain).toBe('');

			const { domain: domain2 } = getEmailData('username', 2);
			expect(domain2).toBe('');
		});
	});

	describe('hasDomain', () => {
		it('Should return true', () => {
			const { hasDomain } = getEmailData('username@gmail.com', 2);
			expect(hasDomain).toBe(true);
		});

		it('Should return false', () => {
			const { hasDomain } = getEmailData('username@', 2);
			expect(hasDomain).toBe(false);

			const { hasDomain: hasDomain2 } = getEmailData('username', 2);
			expect(hasDomain2).toBe(false);
		});
	});
}
