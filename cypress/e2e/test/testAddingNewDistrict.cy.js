// TODO В /support/e2e.js есть обработки ошибок. После исправления разработчиками нужно убрать

import {auth} from "../helpers/auth"
import {pageAdressesOfResident} from "../pages/pageAdressesOfResident"
import {addNewDistrict} from "../helpers/addNewDistrict"

describe('Тест проверки добавления записи при создании нового района', () => {
    let numberInList
    const nameDistrict = 'Новый район'

    beforeEach('Авторизация', ()=> {
        auth()
    })

    it('Создание нового района с заполнением всех обязательных полей', () => {

        pageAdressesOfResident()
        addNewDistrict()

        cy.get('[data-test-id="Название района"]').type(`${nameDistrict}`)
        cy.get('[data-cy="btn-save"]').click()
        cy.contains(`${nameDistrict}`)
    })

    it('Создание района без названия', () => {
        let requestCount = 0

        pageAdressesOfResident()
        addNewDistrict()

        cy.intercept('POST', '/fl/kpvl', (req) => {
            requestCount += 1
            req.continue()
        })

        cy.get('[data-cy="btn-save"]').click()
        cy.get('.v-messages__message').contains('Поле не может быть пустым')

        cy.wait(1000)
        cy.then(() => {
            expect(requestCount).to.equal(0)
        })
    })

    it('Создание района без номера в списке', () => {
        let requestCount = 0

        pageAdressesOfResident()
        addNewDistrict()

        cy.intercept('POST', '/fl/kpvl', (req) => {
            requestCount += 1
            req.continue()
        })

        cy.get('[data-test-id="Название района"]').type(`${nameDistrict}`)
        cy.get('[data-test-id="Номер в списке"]').clear()
        cy.get('[data-cy="btn-save"]').should('be.disabled')
        cy.get('.v-messages__message').contains('Поле не может быть пустым')

        cy.wait(1000)
        cy.then(() => {
            expect(requestCount).to.equal(0)
        })
    })

    it('Создание двух районов с одинковым названием и номером в списке', () => {
        pageAdressesOfResident()
        addNewDistrict()

        cy.get('[data-test-id="Название района"]').type(`${nameDistrict}`)
        cy.get('[data-test-id="Номер в списке"]')
            .invoke('val')
            .then((val) => {
                numberInList = val

                cy.get('[data-cy="btn-save"]').click()
                cy.wait(500)

                addNewDistrict()

                cy.get('[data-test-id="Название района"]').type(`${nameDistrict}`)
                cy.get('[data-test-id="Номер в списке"]').clear()
                cy.get('[data-test-id="Номер в списке"]').type(`${numberInList}`)
                cy.get('[data-cy="btn-save"]').click()
                cy.contains('Номер в списке должен быть уникальным') // Это поправка от меня, не зная четкого ТЗ, но я уверен что тут ошибка. БР-4
            })
    })

    it('Создание района с добавлением параметра "Документ"', () => {
        pageAdressesOfResident()
        addNewDistrict()

        cy.get('[data-test-id="Название района"]').type(`${nameDistrict}`)
        cy.get('.v-toolbar__content > [data-cy="btn-add"]').click()
        cy.contains('ДОКУМЕНТ').click()
        cy.contains('ДОКУМЕНТ')
    })
})
