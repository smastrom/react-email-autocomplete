import { mount } from 'cypress/react';

declare global {
	namespace Cypress {
		interface Chainable {
			mount: typeof mount;
			backSpace(chars: number): Chainable<Element>;
			downArrow(repeat: number): Chainable<Element>;
			upArrow(repeat: number): Chainable<Element>;
		}
	}
}
