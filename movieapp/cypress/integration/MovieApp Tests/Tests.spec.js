/// <reference types="Cypress" />

describe('Form', function () {
    it('Login Test', function () {
        cy.visit('http://localhost:3000/')
        cy.get('input[type=text]').type('admin')
        cy.get('input[type=password]').type('password12!')
        cy.get('button').contains('Login').click()
        cy.contains('Title',{ timeout: 50000 }).should('be.visible')
    })
    it('Submit Entry Test', function () {
        //cy.visit('http://localhost:3000/Entry')
        cy.get('.title').type('Submit Entry Test')
        cy.get('.language').select('French')
        cy.get('.react-datepicker__input-container').children('input').clear().type('01/01/2020')
        //Click on the title to ensure that the datepicker closes to prevent an error for ratings
        cy.get('.title').click()
        cy.get('.star-ratings').click()
        cy.get('.actors').type('Test Actor')
        cy.get('.submit').contains('Add / Save Changes').click()
        //cy.get('div').contains('View').click()
        //**************** */
        cy.server()
        cy.route({
            method: 'GET',
            url: '/movie/entries',
        }).as('apiCheck')
        cy.get('div').contains('View').click()
        cy.wait('@apiCheck').then((xhr) => {
            assert.isNotNull(xhr.response.body.data, '1st API call has data')
        })
        //Assert on View
        cy.contains('Submit Entry Test', { timeout: 30000 }).should('be.visible')
        cy.contains('French').should('be.visible')
        cy.contains('Action').should('be.visible')
        cy.contains('2020').should('be.visible')
        cy.contains('Test Actor').should('be.visible')
    })

    it('Delete Entry Test', function () {
        cy.contains('Submit Entry Test').click()

        cy.server()
        cy.route({
            method: 'GET',
            url: '/movie/entries',
        }).as('apiCheck2')
        cy.get('.delete').click()
        cy.wait('@apiCheck2').then((xhr) => {
            assert.isNotNull(xhr.response.body.data, '2nd API call has data')
        })
        
        cy.contains('Submit Entry Test', { timeout: 50000 }).should('not.be.visible')
    })

    it('Edit Entry Test', function () {
        cy.visit('http://localhost:3000/Entry')
        cy.get('.title').type('Cypress Edit Test')
        cy.get('.actors').type('Edit Test Actor')
        cy.get('.submit').contains('Add / Save Changes').click()
        cy.get('div').contains('View').click()
        cy.contains('Cypress Edit Test', { timeout: 30000 }).should('be.visible')
        cy.contains('Cypress Edit Test').click()
        cy.get('.edit').click()
        cy.get('.actors').clear().type('Edit Test Actor New')
        cy.get('.submit').contains('Add / Save Changes').click()

        cy.server()
        cy.route({
            method: 'GET',
            url: '/movie/entries',
        }).as('apiCheck3')
        cy.get('div').contains('View').click()
        cy.wait('@apiCheck3').then((xhr) => {
            assert.isNotNull(xhr.response.body.data, '3rd API call has data')
        })

        cy.contains('Edit Test Actor New', { timeout: 30000 }).should('be.visible')
    })

    it('Search Bar Test', function () {
        cy.visit('http://localhost:3000/Entry')
        cy.get('.title').type('Search Bar Test')
        cy.get('.actors').type('Test Search Bar')
        cy.get('.submit').contains('Add / Save Changes').click()
        cy.get('div').contains('View').click()
        cy.contains('Search Bar Test', { timeout: 30000 }).should('be.visible')

        cy.get('.search').children('select').select('Title')
        cy.get('.search').children('.input').type('Search Bar Test')
        cy.contains('Cypress Edit Test', { timeout: 30000 }).should('not.be.visible')
    })
})