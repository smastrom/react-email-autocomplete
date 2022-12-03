/* eslint-disable @typescript-eslint/no-namespace */
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

it('Should hide suggestions if no match', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('ul').should('exist');
		cy.get('input').type('xsdasdsad');
		cy.get('ul').should('not.exist');
	});
});

it('Should hide suggestions if clearing', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('ul').should('exist');
		cy.get('input').clear();
		cy.get('ul').should('not.exist');
	});
});

it('Should hide suggestions if exact match', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('li').should('exist');
		cy.get('input').clear().type('myusername@gmail.com');
		cy.get('ul').should('not.exist');
		cy.deleteChars(1);
		cy.get('ul').should('exist');
	});
});

describe('Should update suggestions on input change', () => {
	const initialUsername = 'myusername';

	it('Username', () => {
		cy.mount(<Email refineList={domains} className="WC" />);

		cy.get('.WC').within(() => {
			cy.get('input').type(`${initialUsername}@g`);
			cy.get('span:first-of-type').each((span) => {
				expect(span.text()).to.be.eq(initialUsername);
			});

			cy.get('input').type(`{leftArrow}{leftArrow}`);
			const charsToDel = 4;
			cy.deleteChars(charsToDel);

			cy.get('span:first-of-type').each((span) => {
				expect(span.text()).to.be.eq(initialUsername.slice(0, -charsToDel));
			});
		});
	});

	it('Domain', () => {
		const domain = '@gmail';
		cy.mount(<Email refineList={domains} className="WC" />);

		cy.get('.WC').within(() => {
			cy.get('input').type(`${initialUsername}${domain}`);
			cy.get('span:last-of-type')
				.each((span) => {
					expect(span.text()).to.contain(domain);
				})
				.its('length')
				.then((length) => {
					const charsToDel = 3;
					cy.deleteChars(charsToDel);

					cy.get('span:last-of-type')
						.should('have.length.greaterThan', length)
						.each((span) => {
							expect(span.text()).to.contain(domain.slice(0, -charsToDel));
						});
				});
		});
	});
});

it('Should update input value on suggestion click', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	for (let i = 0; i < 10; i++) {
		cy.get('.WC').within(() => {
			cy.get('input').type('myusername@g');
			cy.get('li')
				.then((list) => {
					return list[Math.floor(Math.random() * list.length)];
				})
				.then((randomLi) => {
					randomLi.trigger('click');
					cy.get('input').should('have.value', randomLi.text()).clear();
				});
		});
	}
});

it('Should keyboard-navigate trough suggestions and input', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	const initialValue = 'myusername@g';

	cy.get('.WC').within(() => {
		cy.get('input').type(initialValue);
		cy.get('li').then((list) => {
			const randomLi = Math.floor(Math.random() * list.length) - 1;
			cy.downArrow(randomLi);
			cy.get('li')
				.eq(randomLi - 1)
				.should('have.focus')
				.and('have.attr', 'tabindex', '0');
			cy.upArrow(randomLi);
			cy.get('input').should('have.focus');
		});
	});
});

it('Should focus input and update value if pressing backspace on suggestion', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	const initialValue = 'myusername@g';
	const charsToDel = 2;

	cy.get('.WC').within(() => {
		cy.get('input').type(initialValue);
		cy.get('li').then((list) => {
			cy.downArrow(list.length);
			cy.deleteChars(charsToDel);
			cy.get('input').should('have.focus').and('have.value', initialValue.slice(0, -charsToDel));
		});
	});
});

it('Should close dropdown if clicking outside', () => {
	cy.mount(
		<Email refineList={domains} className="WC" classNames={{ dropdown: 'dropdownClass' }} />
	);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('ul').should('exist');
	});

	cy.get('body').trigger('click');
	cy.get('.dropdownClass').should('not.exist');
});

it('Should hide dropdown if first result equals to user input email', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('ul').should('exist');
		cy.get('input').type('mail.com');
		cy.get('ul').should('not.exist');
	});
});

it('Should open dropdown only after minChars is reached', () => {});
it('Should display maximum user-defined result number', () => {});

it('Should trigger user onBlur/onFocus only when related target is not a suggestion', () => {});
it('Should be able to add HTML attributes to input element', () => {});
it('Should be able to add custom prefix to dropdown id', () => {});
it('Should be able to focus next element upon selection', () => {});

it('Should be able to update a different state shape', () => {});
