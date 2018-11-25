const logic = require('./logic.js')
const { expect } = require('chai')
require('isomorphic-fetch')
const { mongoose, models: { User, Project, Meeting } } = require('data')
global.sessionStorage = require('sessionstorage')
logic.url = 'http://localhost:5000/api'
const MONGO_URL = 'mongodb://localhost:27017/socialdev-test'

describe('logic', () => {
    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => Promise.all([User.deleteMany(), Project.deleteMany(), Meeting.deleteMany()]))

    describe('users', () => {
        describe('register', () => {
            let name, email, username, password

            beforeEach(() => {
                name = `n-${Math.random()}`
                email = `e-${Math.random()}@gmail.com`
                username = `u-${Math.random()}`
                password = `p-${Math.random()}`
            })

            it('should succeed on correct data', async () => {
                const res = await logic.registerUser(name, email, username, password)

                expect(res).to.be.undefined
            })

            it('should fail on repeted username', async () => {
                try {
                    await logic.registerUser(name, email, username, password)
                    // expect(true).to.be.false
                } catch (err) {
                    expect(err).to.be.instanceof(Error)
                    expect(err.message).to.equal(`username ${username} already registered`)
                }

            })
        })
        describe('login', () => {
            describe('with existing user', () => {
                let username, password
    
                beforeEach(async () => {
                    name = `n-${Math.random()}`
                    email = `e-${Math.random()}@gmail.com`
                    username = `u-${Math.random()}`
                    password = `p-${Math.random()}`
    
                    await logic.registerUser(name, email, username, password)
                })
    
                it('should succeed on correct data', async () => {
                    await logic.authenticate(username, password)
    
                    expect(true).to.be.true
                })
            })
    
    
        })
    
        describe('logout', () => {
            let name, email, username, password
    
            beforeEach(async () => {
                name = `n-${Math.random()}`
                email = `e-${Math.random()}@gmail.com`
                username = `u-${Math.random()}`
                password = `p-${Math.random()}`
    
                await logic.registerUser(name, email, username, password)
                await logic.authenticate(username, password)
            })
    
            it('should succeed on correct data', async () => {
                const res = await logic.logout()
    
                expect(res).to.be.undefined
                expect(logic._userId).to.equal(null)
                expect(logic._token).to.equal(null)
            })
    
            // TODO other test cases
        })
    
        describe('retrieve user', () => {
            describe('with existing user', () => {
                let name, email, username, password
    
                beforeEach(async () => {
                    name = `n-${Math.random()}`
                    email = `e-${Math.random()}@gmail.com`
                    username = `u-${Math.random()}`
                    password = `p-${Math.random()}`
                    await logic.registerUser(name, email, username, password)
                    await logic.authenticate(username, password)
                })
    
                it('should succeed on correct data', async () => {
                    const user = await logic.retrieveUserProfile()
    
                    expect(user.id).to.not.be.undefined
                    expect(user.bio).to.not.be.undefined
                    expect(user.githubProfile).to.not.be.undefined
                    expect(user.name).to.equal(name)
                    expect(user.password).to.be.undefined
    
                })
            })
        })
    
    })

    describe('projects', () => {
        describe('add a project', () => {
            let name, email, username, password
    
                beforeEach(async () => {
                    name = `n-${Math.random()}`
                    email = `e-${Math.random()}@gmail.com`
                    username = `u-${Math.random()}`
                    password = `p-${Math.random()}`
                    await logic.registerUser(name, email, username, password)
                    await logic.authenticate(username, password)
                })

                it('should succeed on correct data', async () => {
                    await logic.addNewProject(name, 'description', ['python', 'java'], 'true', '5')

                    const project =await Project.find()
                    
                    debugger
                })
    
        })
    })

    

    afterEach(() => Promise.all([User.deleteMany(), Project.deleteMany(), Meeting.deleteMany()]))

    after(() => mongoose.disconnect())
})