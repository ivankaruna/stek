export function addNewDistrict() {
    cy.get('[data-cy="btn-add"]').click()
    cy.contains('Район').click()
}