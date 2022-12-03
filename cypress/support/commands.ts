import 'cypress-real-events';

Cypress.Commands.add('backSpace', (chars: number) => {
	cy.realType('{backspace}'.repeat(chars));
});

Cypress.Commands.add('downArrow', (repeat: number) => {
	cy.realType('{downarrow}'.repeat(repeat));
});

Cypress.Commands.add('upArrow', (repeat: number) => {
	cy.realType('{uparrow}'.repeat(repeat));
});

export {};
