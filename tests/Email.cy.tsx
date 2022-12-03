/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Email } from './Email';
import { mount } from 'cypress/react';

declare global {
	namespace Cypress {
		interface Chainable {
			mount: typeof mount;
		}
	}
}

describe('Classnames', () => {
	const someClasses = {
		wrapper: 'WC',
		input: 'IC',
		username: 'UC',
		domain: 'DC',
	};

	it('Should be able to add custom wrapper class', () => {
		cy.mount(<Email className="customWrapperClass" />);
		cy.get('.customWrapperClass').should('exist');
	});

	it('Should be able to add custom classes', () => {
		cy.mount(
			<Email
				classNames={{
					...someClasses,
					dropdown: 'DPC',
					suggestion: 'SC',
				}}
			/>
		);

		cy.get('.WC').within(() => {
			cy.get('input').should('have.class', 'IC').type('myusername');
			cy.get('ul').should('have.class', 'DPC');
			cy.get('li').should('have.class', 'SC');
			cy.get('span:first-of-type').should('have.class', 'UC');
			cy.get('span:last-of-type').should('have.class', 'DC');
		});
	});

	it('Should be able to add only defined classes', () => {
		cy.mount(<Email classNames={someClasses} />);

		cy.get('.WC').within(() => {
			cy.get('input').should('have.class', 'IC').type('myusername');
			cy.get('ul').should('not.have.class', 'DPC');
			cy.get('li').should('not.have.class', 'SC');
			cy.get('span:first-of-type').should('have.class', 'UC');
			cy.get('span:last-of-type').should('have.class', 'DC');
		});
	});

	it('Should add both wrapper classes', () => {
		cy.mount(<Email className="wrapperClass" classNames={{ wrapper: someClasses.wrapper }} />);
		cy.get('.wrapperClass').should('have.class', 'WC');
	});
});

it('Should enable refine mode only if refineList is defined', () => {});

describe('Should update value after selection', () => {
	it('Mouse', () => {});
	it('Keyboard', () => {});
});

it('Should display baseList suggestions and hide them once users press @', () => {});
it('Should display coherent baseList and refineList suggestions according to input change', () => {});
it('Should hide suggestions if no domain match', () => {});

describe('Should update suggestions text content', () => {
	it('Username', () => {});
	it('Domain', () => {});
});

it('Should focus input and update value if pressing backspace on suggestion', () => {});
it('Should navigate trough suggestions and input', () => {});

it('Should hide dropdown if first result equals to user input email', () => {});
it('Should open dropdown only after minChars is reached', () => {});
it('Should display maximum user-defined result number', () => {});

it('Should trigger user onBlur/onFocus only when related target is not a suggestion', () => {});
it('Should be able to add HTML attributes to input element', () => {});
it('Should be able to add custom prefix to dropdown id', () => {});
it('Should be able to focus next element upon selection', () => {});

it('Should be able to update a different state shape', () => {});
