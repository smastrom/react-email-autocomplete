Cypress.Commands.add('deleteChars', (chars: number) => {
	cy.get('input').type('{backspace}'.repeat(chars));
});

Cypress.Commands.add('downArrow', (repeat: number) => {
	cy.get('input').type('{downArrow}'.repeat(repeat));
});

Cypress.Commands.add('upArrow', (repeat: number) => {
	cy.get('input').type('{upArrow}'.repeat(repeat));
});

export {};
