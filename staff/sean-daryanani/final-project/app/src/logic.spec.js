const logic = require('./logic.js')
const { expect } = require('chai')
require('isomorphic-fetch')
const { mongoose, models: { User, Project, Meeting } } = require('data')
global.sessionStorage = require('sessionstorage')
logic.url = 'http://localhost:5000/api'
const MONGO_URL = 'mongodb://localhost:27017/socialdev'

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

        // describe('update user profile', () => {
        //     let user

        //     beforeEach(() => (user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })).save())

        //     it('should update on correct data and password', async () => {
        //         const { id, bio, githubProfile, city } = user

        //         const newBio = `${bio}-${Math.random()}`
        //         const newGithubProfile = `${githubProfile}-${Math.random()}`
        //         const newCity = `${city}-${Math.random()}`
        //         const newSkills = ['react', 'mongoose', 'javascript']


        //         const res = await logic.updateProfile(id, newCity, newGithubProfile, newBio, newSkills)

        //         expect(res).to.be.undefined

        //         const _users = await User.find()

        //         const [_user] = _users

        //         expect(_user.bio).to.equal(newBio)

        //         expect(_user.githubProfile).to.equal(newGithubProfile)
        //         expect(_user.city).to.equal(newCity)
        //         expect(newSkills.length).to.equal(3)

        //     })

        // it('should update on correct bio (and other fields null)', async () => {
        //     const { id, bio, githubProfile, city, skills } = user

        //     const newBio = `${bio}-${Math.random()}`

        //     const res = await logic.updateProfile(id, null, null, newBio, null)

        //     expect(res).to.be.undefined

        //     const _users = await User.find()

        //     const [_user] = _users

        //     expect(_user.bio).to.equal(newBio)

        //     expect(_user.githubProfile).to.equal(githubProfile)
        //     expect(_user.city).to.equal(city)
        //     expect(JSON.stringify(_user.skills)).to.equal(JSON.stringify(skills))

        // })

        // it('should update on correct githubProfile (and other fields null)', async () => {
        //     const { id, bio, githubProfile, city, skills } = user

        //     const newGithubProfile = `${githubProfile}-${Math.random()}`

        //     const res = await logic.updateProfile(id, bio, newGithubProfile, null, null)

        //     expect(res).to.be.undefined

        //     const _users = await User.find()

        //     const [_user] = _users

        //     expect(_user.githubProfile).to.equal(newGithubProfile)

        //     expect(_user.bio).to.equal(bio)
        //     expect(_user.city).to.equal(city)
        //     expect(JSON.stringify(_user.skills)).to.equal(JSON.stringify(skills))

        // })

        // it('should update on correct city (and other fields null)', async () => {
        //     const { id, bio, githubProfile, city, skills } = user

        //     const newCity = `${city}-${Math.random()}`

        //     const res = await logic.updateProfile(id, bio, githubProfile, newCity, null)

        //     expect(res).to.be.undefined

        //     const _users = await User.find()

        //     const [_user] = _users

        //     expect(_user.city).to.equal(newCity)

        //     expect(_user.bio).to.equal(bio)
        //     expect(_user.githubProfile).to.equal(githubProfile)
        //     expect(JSON.stringify(_user.skills)).to.equal(JSON.stringify(skills))

        // })
    })

})

describe('projects', () => {
    describe('add a project', () => {
        let name, email, username, password, description, skills, beginnerFriendly, maxMembers

        beforeEach(async () => {
            name = `n-${Math.random()}`
            email = `e-${Math.random()}@gmail.com`
            username = `u-${Math.random()}`
            password = `p-${Math.random()}`
            description = `text-${Math.random()}`
            skills = [`text-${Math.random()}`, `text-${Math.random()}`, `text-${Math.random()}`]
            beginnerFriendly = 'true'
            maxMembers = `${Math.random()}`
            await logic.registerUser(name, email, username, password)
            await logic.authenticate(username, password)
        })

        it('should succeed on correct data', async () => {



            await logic.addNewProject(name, description, skills, beginnerFriendly, maxMembers)

            const projects = await Project.find()

            const [project] = projects

            expect(project.name).to.equal(name)

            expect(project.description).to.equal(description)

            expect(JSON.stringify(project.skills)).to.equal(JSON.stringify(skills))

            expect(project.beginnerFriendly).to.equal(beginnerFriendly)

            expect(project.maxMembers).to.equal(maxMembers)
            expect(project.currentMembers).to.equal(1)



        })

    })

    describe('list projects', () => {
        let user, project, project2

        beforeEach(async () => {
            user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })

            project = new Project({ name: 'test1', description: 'testdescription1', skills: ['react1', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })

            project2 = new Project({ name: 'test2', description: 'testdescription2', skills: ['react2', 'mongoose2', 'javascript2'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })

            await user.save()
            await project.save()
            await project2.save()
        })

        it('should succeed on listing all projects where user is owner', async () => {
            const projects = await logic.listOwnProjects(user.id)

            expect(projects).not.to.be.undefined

            expect(projects.length).to.equal(2)

            const _projects = await Project.find()

            expect(_projects.length).to.equal(2)

            expect(projects.length).to.equal(_projects.length)

            const [_project, _project2] = _projects

            expect(_project.id).to.equal(project.id)
            expect(_project.name).to.equal(project.name)
            expect(_project.description).to.equal(project.description)
            expect(_project.beginnerFriendly).to.equal(project.beginnerFriendly)
            expect(_project.maxMembers).to.equal(project.maxMembers)

            expect(_project2.id).to.equal(project2.id)
            expect(_project2.name).to.equal(project2.name)
            expect(_project2.description).to.equal(project2.description)
            expect(_project2.beginnerFriendly).to.equal(project2.beginnerFriendly)
            expect(_project2.maxMembers).to.equal(project2.maxMembers)

            const [__project, __project2] = projects

            expect(__project).not.to.be.instanceof(Project)
            expect(__project2).not.to.be.instanceof(Project)

            expect(_project.id).to.equal(__project.id)
            expect(_project.name).to.equal(__project.name)
            expect(_project.description).to.equal(__project.description)
            expect(_project.beginnerFriendly).to.equal(__project.beginnerFriendly)
            expect(_project.maxMembers).to.equal(__project.maxMembers)

            expect(_project2.id).to.equal(__project2.id)
            expect(_project2.name).to.equal(__project2.name)
            expect(_project2.description).to.equal(__project2.description)
            expect(_project2.beginnerFriendly).to.equal(__project2.beginnerFriendly)
            expect(_project2.maxMembers).to.equal(__project2.maxMembers)



        })

        it('should succeed on listing all projects where user a collaborator', async () => {
            const user2 = new User({ name: 'John2', email: 'doe2@gmail.com', username: 'jd2', password: '123' })

            let project3 = new Project({ name: 'test1', description: 'testdescription1', skills: ['react1', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user2.id, collaborators: [user.id] })

            let project4 = new Project({ name: 'test1', description: 'testdescription1', skills: ['react1', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user2.id, collaborators: [user.id] })

            let project5 = new Project({ name: 'test1', description: 'testdescription1', skills: ['react1', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user2.id, collaborators: [user.id] })

            await user2.save()
            await project3.save()
            await project4.save()
            await project5.save()

            const projects = await logic.listCollaboratingProjects(user.id)

            expect(projects).not.to.be.undefined

            expect(projects.length).to.equal(3)

            const _projects = await Project.find({ collaborators: user._id })

            expect(_projects.length).to.equal(3)

            expect(projects.length).to.equal(_projects.length)

            const [_project1, _project2, _project3] = _projects

            expect(_project1.collaborators[0].toString()).to.equal(user.id)
            expect(_project2.collaborators[0].toString()).to.equal(user.id)
            expect(_project3.collaborators[0].toString()).to.equal(user.id)


        })

        

        

    })

    describe('save a project ', () => {
        let user, user2, project

        beforeEach(async () => {

            user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })

            user2 = new User({ name: 'John2', email: 'doe2@gmail.com', username: 'jd2', password: '123' })

            project = new Project({ name: 'test1', description: 'testdescription1', skills: ['react1', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user2.id })

            await user.save()
            await user2.save()
            await project.save()
        })

        it('should succeed on correct data', async () => {

            await logic.saveProject(project.id)
            debugger
            const _user = await User.findById(user.id)

            expect(_user.savedProjects.length).to.equal(1)

            expect(_user.savedProjects[0].toString()).to.equal(project.id)



        })
    })




    afterEach(() => Promise.all([User.deleteMany(), Project.deleteMany(), Meeting.deleteMany()]))

    after(() => mongoose.disconnect())
})