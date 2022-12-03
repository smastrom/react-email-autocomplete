Cypress.Commands.add('deleteChars', (chars: number) => {
	cy.get('input').type('{backspace}'.repeat(chars));
});

export {};
