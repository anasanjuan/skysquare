require('dotenv').config()

require('isomorphic-fetch')

global.sessionStorage = require('sessionstorage')

const {expect} = require( 'chai')
const logic = require ('./logic')

const {mongoose, models: { User, Place, Picture }} = require('skysquare-data')


logic.url = process.env.REACT_APP_API_URL


describe('logic', ()=> {

    describe('Users', () => {
        !false && describe('Register', () => {
                it('should succed on correct data', () => {
                    logic.register('John', 'Doe', 'jd@gmail.com', '123', '20/02/2000', 'Male', '555555555555')
                        .then(expect(true).to.be.true)
                })
        })

        describe('LogIn', () => {
            let email, password
            beforeEach(() => {
                email = `jd-${Math.random()}@example.com`

                password = `jd-${Math.random()}`

                return logic.register('John', 'Doe', email, password, '20/02/2000', 'Male', '555555555555')
                    .then(expect(true).to.be.true)
            })
                
            
            it('should succed on correct data', () => {
                logic.logIn('jd@gmail.com', '123')
                    .then(expect(true).to.be.true)
                
            })

            it('should fail on wrong email', () => {
                let dummyEmail = `dummy-${Math.random()}`

                return logic.logIn(dummyEmail, password)
                    .catch(err => {
                        expect(err).not.to.be.undefined
                        expect(err.message).to.equal(`invalid username or password`)
                    })
            })

            it('should fail on wrong password', () => {
                let dummyPassword = `dummy-${Math.random()}`

                return logic.logIn(email, dummyPassword)
                    .catch(err => {
                        expect(err).not.to.be.undefined
                        expect(err.message).to.equal(`invalid username or password`)
                    })
            })

        })
    })
})
