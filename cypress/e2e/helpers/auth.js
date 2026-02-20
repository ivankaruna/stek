export function auth() {
    cy.intercept('/app/graphql').as('auth')

    cy.visit(`${Cypress.env('baseUrl')}`)
    cy.get('[data-cy="login"]').type(`${Cypress.env('login')}`)
    cy.get('[data-cy="password"]').type(`${Cypress.env('password')}`)
    cy.get('button[data-cy="submit-btn"]').click()
    cy.wait('@auth').then((auth) => {
        expect(auth.request.body.variables.login).to.be.eq(`${Cypress.env('login')}`)
        expect(auth.request.body.variables.password).to.be.eq(`${Cypress.env('password')}`)

        const errors = auth.response.body.errors

        if (errors && errors.length && errors[0].message === 'Repeated entry is fixed under your login') {
            cy.get('[data-cy="btn-yes"]').click()
        }
    })
}