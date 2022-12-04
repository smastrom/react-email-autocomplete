import { Email, lists } from './useLocalizedList';

const username = 'myusername';
const INPUT_ID = 'InputId';

describe('Navigator language without country code - [it]', () => {
	beforeEach(() => {
		cy.setNavigatorLang('it');
	});

	it('Should display it domains', () => {
		cy.mount(<Email id={INPUT_ID} lists={lists} />);

		cy.getSuggestions(`#${INPUT_ID}`, username).each((li, index) => {
			expect(li.text()).to.be.eq(`${username}@${lists.it[index]}`);
		});
	});
});

describe('Navigator language with country code - [it-CH]', () => {
	beforeEach(() => {
		cy.setNavigatorLang('it-CH');
	});

	it('Should display it-CH domains', () => {
		cy.mount(<Email id={INPUT_ID} lists={lists} />);

		cy.getSuggestions(`#${INPUT_ID}`, username).each((li, index) => {
			expect(li.text()).to.be.eq(`${username}@${lists['it-CH'][index]}`);
		});
	});

	it('Should display it domains if it-CH not included in lang list', () => {
		const { it, default: fallback } = lists;
		const newList = { it, default: fallback };

		cy.mount(<Email id={INPUT_ID} lists={newList} />);

		cy.getSuggestions(`#${INPUT_ID}`, username).each((li, index) => {
			expect(li.text()).to.be.eq(`${username}@${newList.it[index]}`);
		});
	});

	it('Should display default domains if no it included in lang list', () => {
		const { default: fallback } = lists;
		const newList = { default: fallback };

		cy.mount(<Email id={INPUT_ID} lists={newList} />);

		cy.getSuggestions(`#${INPUT_ID}`, username).each((li, index) => {
			expect(li.text()).to.be.eq(`${username}@${newList.default[index]}`);
		});
	});
});

describe('Unknown navigator language - [de-DE]', () => {
	beforeEach(() => {
		cy.setNavigatorLang('de-DE');
	});

	it('Should display default domains', () => {
		cy.mount(<Email id={INPUT_ID} lists={lists} />);

		cy.getSuggestions(`#${INPUT_ID}`, username).each((li, index) => {
			expect(li.text()).to.be.eq(`${username}@${lists.default[index]}`);
		});
	});
});
