import { mount } from 'cypress/react';

declare global {
	namespace Cypress {
		interface Chainable {
			mount: typeof mount;
			downArrow(repeat: number): Chainable<Element>;
			upArrow(repeat: number): Chainable<Element>;
			setNavigatorLang(value: string): Chainable<Window>;
			getSuggestions(selector: string, username: string): Chainable<Element>;
		}
	}
}
