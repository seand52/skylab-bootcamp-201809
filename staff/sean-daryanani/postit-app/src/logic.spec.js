//import logic from './logic'

require('isomorphic-fetch')

global.sessionStorage = require('sessionstorage')

const logic = require('./logic')

const { expect } = require('chai')

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    describe('users', () => {
        describe('register', () => {
            it('should succeed on correct data', () =>
                logic.registerUser('John', 'Doe', `jd-${Math.random()}`, '123')
                    .then(() => expect(true).to.be.true)
            )

            it('should fail on trying to register twice same user', () => {
                const username = `jd-${Math.random()}`

                return logic.registerUser('John', 'Doe', username, '123')
                    .then(() => logic.registerUser('John', 'Doe', username, '123'))
                    .catch(err => {
                        expect(err).not.to.be.undefined
                        expect(err.message).to.equal(`user with username "${username}" already exists`)
                    })
            })

            it('should fail on undefined name', () => {
                expect(() =>
                    logic.registerUser(undefined, 'Doe', 'jd', '123')
                ).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other cases
        })

        describe('login', () => {
            describe('with existing user', () => {
                let username, password

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    return logic.registerUser(name, surname, username, password)

                })

                it('should succeed on correct data', () =>
                    logic.login(username, password)
                        .then(() => expect(true).to.be.true)
                )

                it('should fail on wrong username', () => {
                    debugger
                    username = `dummy-${Math.random()}`
                    return logic.login(username, password)
                        .catch(err => {
                            debugger
                            expect(err).not.to.be.undefined
                            expect(err.message).to.equal(`user with username "${username}" does not exist`)
                        })
                })

                it('should fail on wrong password', () => {
                    password = 'pepito'

                    return logic.login(username, password)
                        .catch(err => {
                            expect(err).not.to.be.undefined
                            expect(err.message).to.equal(`user with username "${username}" does not exist`)
                        })
                })
            })

            it('should fail on undefined username', () => {
                const username = undefined

                expect(() =>
                    logic.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            it('should fail on boolean username', () => {
                const username = true

                expect(() =>
                    logic.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            it('should fail on numeric username', () => {
                const username = 123

                expect(() =>
                    logic.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            // TODO other cases
        })
    })

    describe('postits', () => {
        describe('create', () => {
            describe('with existing user', () => {
                let username, password, text, id, token

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`


                    return logic.registerUser(name, surname, username, password)
                        .then(() => {


                            return logic.login(username, password)
                                .then(res => {

                                    id = res.data.id
                                    token = res.data.token
                                })
                        })
                })

                it('should succeed on correct data', () => {

                    return logic.createPostit(text, id, token)
                        .then(() => expect(true).to.be.true)
                }
                )
            })
        })

        describe('list', () => {
            describe('with existing user', () => {
                let username, password, text, id, token

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                        .then(() => {


                            return logic.login(username, password)
                                .then(res => {

                                    id = res.data.id
                                    token = res.data.token

                                })
                        })
                })

                describe('with existing postit', () => {
                    beforeEach(() => logic.createPostit(text, id, token))

                    it('should return postits', () =>
                        logic.listPostits(id, token)
                            .then(postits => {
                                expect(postits).not.to.be.undefined
                                expect(postits.length).to.equal(1)
                            })
                    )
                })

                it('should return no postits', () =>
                    logic.listPostits(id, token)
                        .then(postits => {
                            expect(postits).not.to.be.undefined
                            expect(postits.length).to.equal(0)
                        })
                )
            })
        })

        describe('delete', () => {
            describe('with existing user', () => {
                let username, password, text, postitId, id, token

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                        .then(() => {
                            return logic.login(username, password)
                                .then((res) => {
                                    id = res.data.id
                                    token = res.data.token
                                })
                        })
                })

                describe('with existing postit', () => {
                    beforeEach(() =>
                        logic.createPostit(text, id, token)
                            .then(() => logic.listPostits(id, token))
                            .then(postits => postitId = postits[0].id)
                    )

                    it('should succeed', () =>
                        logic.deletePostit(postitId, id, token)
                            .then(() => expect(true).to.be.true)
                    )
                })
            })
        })

        describe('update', () => {
            describe('with existing user', () => {
                let username, password, text, postitId, id, token

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                        .then(() => {
                            return logic.login(username, password)
                                .then(res => {
                                    id = res.data.id
                                    token = res.data.token
                                })

                        })
                })

                describe('with existing postit', () => {
                    let newText

                    beforeEach(() => {
                        newText = `hello ${Math.random()}`

                        return logic.createPostit(text, id, token)
                            .then(() => logic.listPostits(id, token))
                            .then(([postit]) => postitId = postit.id)
                    })

                    it('should succeed', () =>
                        logic.updatePost(postitId, newText, id, token)
                            .then(() => {
                                expect(true).to.be.true

                                return logic.listPostits(id, token)
                            })
                            .then(postits => {
                                expect(postits).not.to.be.undefined
                                expect(postits.length).to.equal(1)

                                const [postit] = postits

                                expect(postit.id).to.equal(postitId)
                                expect(postit.text).to.equal(newText)
                            })
                    )
                })
            })
        })

        describe('update user profile', () => {
            describe('should succeed on updating username', () =>{

                let username, password, text, postitId, id, token

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                        .then(() => {
                            return logic.login(username, password)
                                .then(res => {
                                    debugger
                                    id = res.data.id
                                    token = res.data.token
                                })

                        })
                })
            })
        })
    })
})