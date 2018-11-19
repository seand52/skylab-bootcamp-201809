const mongoose = require('mongoose')
const { User, Project, Meeting } = require('../data')
const logic = require('.')
const { AlreadyExistsError, ValueError } = require('../errors')
const { expect } = require('chai')
const MONGO_URL = 'mongodb://localhost:27017/socialdev-test'

describe('logic', () => {
    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => Promise.all([User.deleteMany(), Project.deleteMany(), Meeting.deleteMany()]))

    describe('user', () => {
        describe('register', () => {
            let name, email, username, password

            beforeEach(() => {
                name = `name-${Math.random()}`
                email = `email-${Math.random()}@gmail.com`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
            })

            it('should succeed on correct data', async () => {
                const res = await logic.registerUser(name, email, username, password)

                expect(res).to.be.undefined

                const users = await User.find()

                expect(users.length).to.equal(1)

                const [user] = users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.email).to.equal(email)
                expect(user.username).to.equal(username)
                expect(user.password).to.equal(password)
                expect(user.bio).to.equal('Bio is empty')
                expect(user.githubProfile).to.equal('Github profile is empty')
                expect(user.city).to.equal('City is empty')
            })

            it('should fail on undefined name', () => {
                expect(() => logic.registerUser(undefined, email, username, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty name', () => {
                expect(() => logic.registerUser('', email, username, password)).to.throw(ValueError, 'name is empty or blank')
            })

            it('should fail on blank name', () => {
                expect(() => logic.registerUser('   \t\n', email, username, password)).to.throw(ValueError, 'name is empty or blank')
            })

        })

        describe('authenticate', () => {
            let user

            beforeEach(() => (user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })).save())

            it('should authenticate on correct credentials', async () => {
                const { username, password } = user

                const id = await logic.authenticateUser(username, password)

                expect(id).to.exist
                expect(id).to.be.a('string')

                const users = await User.find()

                const [_user] = users

                expect(_user.id).to.equal(id)
            })

            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })


        }),

        describe('retrieve', () => {
            let user

            beforeEach(async () => {
                user = new User({ name: 'John', email: 'doe2@gmail.com', username: 'jd', password: '123' })

                await user.save()
            })

            it('should succeed on valid id', async () => {
                const _user = await logic.retrieveUser(user.id)

                expect(_user).not.to.be.instanceof(User)

                const { id, name, email, username, password, bio, githubProfile, savedProjects, city} = _user

                expect(id).to.exist
                expect(id).to.be.a('string')
                expect(id).to.equal(user.id)
                expect(name).to.equal(user.name)
                expect(email).to.equal(user.email)
                expect(username).to.equal(user.username)
                expect(password).to.be.undefined
                expect(bio).to.equal(user.bio)
                expect(githubProfile).to.equal(user.githubProfile)
                expect(JSON.stringify(savedProjects)).to.equal(JSON.stringify(user.savedProjects))
                expect(city).to.equal(user.city)

                
            })
        }),

        describe('update', () => {
            let user

            beforeEach(() => (user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })).save())

            it('should update on correct data and password', async () => {
                const { id, name, email, username, password } = user

                const newName = `${name}-${Math.random()}`
                const newemail = `doe32@gmail.com`
                const newUsername = `${username}-${Math.random()}`
                const newPassword = `${password}-${Math.random()}`

                const res = await logic.updateUser(id, newName, newemail, newUsername, newPassword, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(newName)
                expect(_user.email).to.equal(newemail)
                expect(_user.username).to.equal(newUsername)
                expect(_user.password).to.equal(newPassword)
            })

            it('should update on correct id, name and password (other fields null)', async () => {
                const { id, name, email, username, password } = user

                const newName = `${name}-${Math.random()}`

                const res = await logic.updateUser(id, newName, null, null, null, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(newName)
                expect(_user.email).to.equal(email)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })

            it('should update on correct id, email and password (other fields null)', async () => {
                const { id, name, email, username, password } = user

                const newemail = `doe48124@gmail.com`

                const res = await logic.updateUser(id, null, newemail, null, null, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(name)
                expect(_user.email).to.equal(newemail)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })

            // TODO other combinations of valid updates

            it('should fail on undefined id', () => {
                const { id, name, email, username, password } = user

                expect(() => logic.updateUser(undefined, name, email, username, password, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases

            describe('with existing user', () => {
                let user2

                beforeEach(async () => {
                    user2 = new User({ name: 'John', email: 'doe52@gmail.com', username: 'jd2', password: '123' })

                    await user2.save()
                })

                it('should update on correct data and password', async () => {
                    const { id, name, email, username, password } = user2

                    const newUsername = 'jd'

                    try {
                        const res = await logic.updateUser(id, null, null, newUsername, null, password)

                        expect(true).to.be.false
                    } catch (err) {
                        expect(err).to.be.instanceof(AlreadyExistsError)
                    } finally {
                        const _user = await User.findById(id)

                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(name)
                        expect(_user.email).to.equal(email)
                        expect(_user.username).to.equal(username)
                        expect(_user.password).to.equal(password)
                    }
                })
            })
        })

    })

    afterEach(() => Promise.all([User.deleteMany(), Project.deleteMany(), Meeting.deleteMany()]))

    after(() => mongoose.disconnect())
})