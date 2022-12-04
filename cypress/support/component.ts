import { mount } from 'cypress/react';
import 'cypress-real-events';
import 'cypress-axe';

import '../../app/styles/app.css';
import '../../app/styles/fonts.css';
import '../../app/styles/input.css';
import '../../app/styles/preflight.css';

Cypress.Commands.add('mount', mount);

Cypress.Commands.add('backSpace', (chars: number) => {
	cy.realType('{backspace}'.repeat(chars));
});

Cypress.Commands.add('downArrow', (repeat: number) => {
	cy.realType('{downarrow}'.repeat(repeat));
});

Cypress.Commands.add('upArrow', (repeat: number) => {
	cy.realType('{uparrow}'.repeat(repeat));
});

export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}
