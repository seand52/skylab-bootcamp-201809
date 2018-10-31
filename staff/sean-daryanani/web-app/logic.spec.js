const logic = require('./logic')
const { expect } = require('chai')

describe('logic', () => {
    describe('users', () => {
        describe('register', () => {
            beforeEach(() => {
                logic._users = []
            })
            it('should succeed on correct data', () => {
                logic.registerUser('John', 'Doe', 'jd123', '123')
                expect(logic._users.length).to.equal(1)
            })
            it('should fail on undefined name', () => {

                expect(function() { logic.registerUser(undefined, 'test', 'test1', 'test2'); })
                .to.throw('undefined is not a string');

            })

            it('should fail on undefined surname', () => {

                expect(function() { logic.registerUser('John', undefined, 'test1', 'test2'); })
                .to.throw('undefined is not a string');

            })
            it('should fail on undefined username', () => {

                expect(function() { logic.registerUser('John', 'Doe', undefined, 'test2'); })
                .to.throw('undefined is not a string');

            })

            it('should fail on undefined password', () => {

                expect(function() { logic.registerUser('John', 'Doe', 'test235', undefined); })
                .to.throw('undefined is not a string');

            })

            it('should fail on blank name', () => {

                expect(function() { logic.registerUser('', 'Doe', 'test235', '5123'); })
                .to.throw('name is empty or blank');

            })

            it('should fail on blank surname', () => {

                expect(function() { logic.registerUser('John', '', 'test235', '5123'); })
                .to.throw('surname is empty or blank');

            })

            it('should fail on blank username', () => {

                expect(function() { logic.registerUser('John', 'Doe', '', '5123'); })
                .to.throw('username is empty or blank');

            })

            it('should fail on blank username', () => {

                expect(function() { logic.registerUser('John', 'Doe', 'asdf', ''); })
                .to.throw('password is empty or blank');

            })
        })

        describe('login', () => {
          
            let username, password

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                })

                it('should succeed on correct data', () => {
                    logic.login(username, password)
                    expect(logic._user).to.not.equal(null)
                })

             it('should fail on undefined username', () => {

                expect(function() { logic.login(undefined, password); })
                .to.throw('undefined is not a string');

            })

            it('should fail on undefined password', () => {

                expect(function() { logic.login(username, undefined); })
                .to.throw('undefined is not a string');

            })

            it('should fail on blank username', () => {

                expect(function() { logic.login('', password); })
                .to.throw('username is empty or blank');

            })

            it('should fail on blank password', () => {

                expect(function() { logic.login(username, ''); })
                .to.throw('password is empty or blank');

            })
        })
    })
})