/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Email } from './Email';
import domains from '../src/domains.json';

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

it('Should display coherent baseList suggestions according to input change', () => {
	const baseList = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com'];
	cy.mount(<Email baseList={baseList} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusern');
		cy.get('li').each((li, index) => {
			expect(li.text()).to.contain(`myusern@${baseList[index]}`);
		});
	});
});

it('Should hide baseList suggestions once users press @', () => {
	const baseList = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com'];
	cy.mount(<Email baseList={baseList} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername');
		cy.get('li').should('have.length', baseList.length);
		cy.get('input').type('@');
		cy.get('ul').should('not.exist');
		cy.get('li').should('not.exist');
	});
});

it('Should display coherent refineList suggestions according to input change', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('li').each((li) => {
			expect(li.text()).to.contain('myusername@g');
		});
		cy.get('input').type('m');
		cy.get('li').each((li) => {
			expect(li.text()).to.contain('myusername@gm');
		});
		cy.get('input').type('x');
		cy.get('li').each((li) => {
			expect(li.text()).to.contain('myusername@gmx');
		});
	});
});

it('Should hide suggestions if no match', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('li').should('exist');

		cy.get('input').type('xsdasdsad');
		cy.get('li').should('not.exist');
	});
});

it('Should hide suggestions if clearing', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('li').should('exist');
		cy.get('input').clear();
		cy.get('li').should('not.exist');
	});
});

describe.only('Should update suggestions on input change', () => {
	it('Username', () => {
		cy.mount(<Email refineList={domains} className="WC" />);

		cy.get('.WC').within(() => {
			const initialUsername = 'myusername';

			cy.get('input').type(`${initialUsername}@g`);
			cy.get('span:first-of-type').each((span) => {
				expect(span.text()).to.contain(initialUsername);
			});

			cy.get('input').type(`{leftArrow}{leftArrow}`);
			cy.deleteChars(4);

			cy.get('span:first-of-type').each((span) => {
				expect(span.text()).to.be.eq(initialUsername.slice(0, -4));
			});
		});
	});
	it('Domain', () => {});
});

it('Should display suggestion on paste', () => {});

describe('Should update value after selection', () => {
	it('Mouse', () => {});
	it('Keyboard', () => {});
});

it('Should focus input and update value if pressing backspace on suggestion', () => {});
it('Should navigate trough suggestions and input', () => {});
it('Should close dropdown if clicking outside', () => {});

it('Should hide dropdown if first result equals to user input email', () => {});
it('Should open dropdown only after minChars is reached', () => {});
it('Should display maximum user-defined result number', () => {});

it('Should trigger user onBlur/onFocus only when related target is not a suggestion', () => {});
it('Should be able to add HTML attributes to input element', () => {});
it('Should be able to add custom prefix to dropdown id', () => {});
it('Should be able to focus next element upon selection', () => {});

it('Should be able to update a different state shape', () => {});
