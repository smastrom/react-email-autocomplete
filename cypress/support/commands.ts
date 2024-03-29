import { mount } from 'cypress/react'

Cypress.Commands.add('mount', mount)

Cypress.Commands.add('downArrow', (repeat: number) => {
   cy.realType('{downarrow}'.repeat(repeat))
})

Cypress.Commands.add('upArrow', (repeat: number) => {
   cy.realType('{uparrow}'.repeat(repeat))
})

Cypress.Commands.add('setNavigatorLang', (value: string) => {
   cy.window().then((window) => {
      Object.defineProperty(window.navigator, 'language', {
         value,
         configurable: true,
      })
   })
})

Cypress.Commands.add('getSuggestions', (selector: string, username: string) => {
   cy.get(selector).type(username)
   cy.get('li')
})

Cypress.Commands.add('withinRoot', (fn: () => void) => {
   cy.get('.Root').within(fn)
})
