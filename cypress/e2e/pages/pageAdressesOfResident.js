export function pageAdressesOfResident() {
    cy.contains('Адресный фонд').click()
    cy.contains('Адреса проживающих').click()
}