/* eslint-disable @typescript-eslint/no-namespace */
import { mount } from 'cypress/react';
import '../../app/styles/app.css';
import '../../app/styles/fonts.css';
import '../../app/styles/input.css';
import '../../app/styles/preflight.css';

declare global {
	namespace Cypress {
		interface Chainable {
			mount: typeof mount;
		}
	}
}

Cypress.Commands.add('mount', mount);
