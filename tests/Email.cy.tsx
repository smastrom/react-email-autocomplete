import { Email } from './Email';
import { getRandomIndex, getRandomInt } from '../cypress/support/component';
import domains from '../src/domains.json';

it('Should pass ARIA axe tests', () => {
	cy.mount(<Email className="WC" />);
	cy.get('.WC').within(() => {
		cy.get('input').type('myuser');
	});
	cy.downArrow(2);
	cy.injectAxe();
	cy.checkA11y('.WC', {
		runOnly: ['cat.aria']
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

	const user = 'myusername';

	cy.get('.WC').within(() => {
		cy.get('input').type(`${user}@g`);
		cy.get('li').each((li) => {
			expect(li.text()).to.contain(`${user}@g`);
		});
		cy.get('input').type('m');
		cy.get('li').each((li) => {
			expect(li.text()).to.contain(`${user}@gm`);
		});
		cy.get('input').type('x');
		cy.get('li').each((li) => {
			expect(li.text()).to.contain(`${user}@gmx`);
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
		cy.get('input').type('{backspace}');
		cy.get('ul').should('exist');
	});
});

it('Should hide suggestions if clicking outside', () => {
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

it('Should hide suggestions if pressing escape key', () => {
	cy.mount(
		<Email refineList={domains} className="WC" classNames={{ dropdown: 'dropdownClass' }} />
	);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('ul').should('exist');
	});

	cy.realType('{esc}');
	cy.get('.dropdownClass').should('not.exist');
});

it('Should hide refineList suggestions if multiple @ in domain', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@gm@');
		cy.get('ul').should('not.exist');
	});
});

it('Should hide refineList suggestions if deleting username', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	const username = 'username';
	const domain = '@gmail';

	cy.get('.WC').within(() => {
		cy.get('input').type(`${username}${domain}`);
		cy.get('ul').should('exist');
		cy.get('input')
			.type('{leftArrow}'.repeat(domain.length))
			.type('{backspace}'.repeat(username.length));
		cy.get('ul').should('not.exist');
	});
});

it('Should update suggestions username on username change', () => {
	const initialUsername = 'myusername';

	it('Username', () => {
		cy.mount(<Email refineList={domains} className="WC" />);

		cy.get('.WC').within(() => {
			cy.get('input').type(`${initialUsername}@g`);
			cy.get('span:first-of-type').each((span) => {
				expect(span.text()).to.be.eq(initialUsername);
			});

			cy.get('input').type(`{leftArrow}{leftArrow}`);
			const charsToDel = getRandomInt(1, initialUsername.length);
			cy.get('input').type(`${'{backspace}'.repeat(charsToDel)}`);

			cy.get('span:first-of-type').each((span) => {
				expect(span.text()).to.be.eq(initialUsername.slice(0, -charsToDel));
			});
		});
	});
});

it('Should update input value on suggestion click', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	for (let i = 0; i < 10; i++) {
		cy.get('.WC').within(() => {
			cy.get('input').type('myusername@g');
			cy.get('li').then((list) => {
				const randomIndex = getRandomIndex(list.length);
				list.eq(randomIndex).trigger('click');
				cy.get('input').should('have.value', list[randomIndex].textContent).clear();
			});
		});
	}
});

it('Should update input value on suggestion keydown', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	for (let i = 0; i < 10; i++) {
		cy.get('.WC').within(() => {
			cy.get('input').type('myusername@g');
			cy.get('li').then((list) => {
				const randomIndex = getRandomIndex(list.length);
				cy.downArrow(randomIndex + 1);
				cy.get('li')
					.eq(randomIndex)
					.should('have.focus')
					.and('have.attr', 'aria-selected', 'true')
					.type('{enter}');
				cy.get('input').should('have.value', list[randomIndex].textContent).clear();
			});
		});
	}
});

it('Should keyboard-navigate trough suggestions and input', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('li').then((list) => {
			const randomIndex = getRandomIndex(list.length);
			cy.downArrow(randomIndex + 1);
			cy.get('li').eq(randomIndex).should('have.focus').and('have.attr', 'aria-selected', 'true');
			cy.upArrow(randomIndex + 1);
			cy.get('input').should('have.focus');
		});
	});
});

it('Should be able to set FIRST focused suggestion by resuming from hovered one', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('li').then((list) => {
			let randomIndex = getRandomIndex(list.length);
			// Force to not get the first suggestion index
			if (randomIndex === 0) {
				randomIndex = 1;
			}
			cy.get('li').eq(randomIndex).realMouseMove(10, 10);
			cy.get('input').type('{upArrow}');
			cy.get('li')
				.eq(randomIndex - 1)
				.should('have.focus')
				.and('have.attr', 'aria-selected', 'true');
		});
	});
});

it('Should be able to UPDATE focused suggestion by resuming from hovered one', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g').type('{downArrow}'.repeat(1)); // Focus 1st suggestion
		cy.get('li').eq(0).should('have.focus').and('have.attr', 'aria-selected', 'true');
		cy.get('li').eq(3).realMouseMove(10, 10); // Hover 4th suggestion
		cy.upArrow(1);
		cy.get('li').eq(2).should('have.focus').and('have.attr', 'aria-selected', 'true');
	});
});

it('Should focus and update input value if pressing alphanumeric chars from a suggestion', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('li').then((list) => {
			cy.get('input').type('{downArrow}'.repeat(getRandomIndex(list.length)));
			cy.realType('mail');
			cy.get('input').should('have.focus').and('have.value', 'myusername@gmail');
		});
	});
});

it('Should focus and update input value if pressing backspace on a suggestion', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	const initialValue = 'myusername@g';
	const charsToDel = 2;

	cy.get('.WC').within(() => {
		cy.get('input').type(initialValue);
		cy.get('li').then((list) => {
			cy.downArrow(list.length);
			cy.realType('{backspace}'.repeat(charsToDel));
			cy.get('input').should('have.focus').and('have.value', initialValue.slice(0, -charsToDel));
		});
	});
});

it('Should open dropdown only after minChars is reached', () => {
	cy.mount(<Email refineList={domains} className="WC" minChars={4} />);

	const charsArr = 'myus'.split('');

	cy.get('.WC').within(() => {
		charsArr.forEach((char, index) => {
			cy.get('input').type(char);
			if (index === charsArr.length - 1) {
				cy.get('ul').should('exist');
			} else {
				cy.get('ul').should('not.exist');
			}
		});
	});
});

it('Should display maximum user-defined result number', () => {
	cy.mount(<Email refineList={domains} className="WC" maxResults={3} />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myusername@g');
		cy.get('li').should('have.length', 3);
	});
});

it('Should trigger user onBlur/onFocus only if related target is not a suggestion', () => {
	cy.mount(<Email refineList={domains} className="WC" />);

	cy.get('.WC').within(() => {
		cy.get('input').focus().type('myusername@g');
		cy.get('li').then((list) => {
			const randomIndex = getRandomIndex(list.length);
			for (let i = 0; i < 10; i++) {
				cy.downArrow(randomIndex + 1);
				cy.upArrow(randomIndex + 1);
			}
			cy.get('input').should('have.focus').blur();
		});
	});

	cy.get('#CyFocusData')
		.should('have.attr', 'data-cy-focus', '1')
		.and('have.attr', 'data-cy-blur', '1');
});

it('Should be able to forward HTML attributes to input element', () => {
	const name = 'MyName';
	const placeholder = 'MyPlaceholder';
	const pattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

	cy.mount(
		<Email
			className="WC"
			name={name}
			placeholder={placeholder}
			pattern={pattern}
			disabled
			required
			readOnly
		/>
	);

	cy.get('.WC').within(() => {
		cy.get('input')
			.should('have.attr', 'name', name)
			.and('have.attr', 'placeholder', placeholder)
			.and('have.attr', 'pattern', pattern)
			.and('be.disabled')
			.and('have.attr', 'readonly', 'readonly')
			.and('have.attr', 'required', 'required');
	});
});

it('Should be able to add custom prefix to dropdown id', () => {
	const prefix = 'MyPrefix_';
	cy.mount(<Email className="WC" customPrefix={prefix} />);

	cy.get('.WC').within(() => {
		cy.get('input').type('myuser');
		cy.get('ul').invoke('attr', 'id').should('contain', prefix);
	});
});

describe('Classnames', () => {
	const classes = {
		wrapper: 'WC',
		input: 'IC',
		username: 'UC',
		domain: 'DC'
	};

	it('Should be able to add custom wrapper class', () => {
		cy.mount(<Email className="customWrapperClass" />);
		cy.get('.customWrapperClass').should('exist');
	});

	it('Should be able to add custom classes', () => {
		cy.mount(
			<Email
				classNames={{
					...classes,
					dropdown: 'DPC',
					suggestion: 'SC'
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
		cy.mount(<Email classNames={classes} />);

		cy.get('.WC').within(() => {
			cy.get('input').should('have.class', 'IC').type('myusername');
			cy.get('ul').should('not.have.class', 'DPC');
			cy.get('li').should('not.have.class', 'SC');
			cy.get('span:first-of-type').should('have.class', 'UC');
			cy.get('span:last-of-type').should('have.class', 'DC');
		});
	});

	it('Should add both wrapper classes', () => {
		cy.mount(<Email className="wrapperClass" classNames={{ wrapper: classes.wrapper }} />);
		cy.get('.wrapperClass').should('have.class', 'WC');
	});
});
