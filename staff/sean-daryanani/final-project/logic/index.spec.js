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

            describe('retrieve user info', () => {
                let user

                beforeEach(async () => {
                    user = new User({ name: 'John', email: 'doe2@gmail.com', username: 'jd', password: '123' })

                    await user.save()
                })

                it('should succeed on valid id', async () => {
                    const _user = await logic.retrieveUser(user.id)

                    expect(_user).not.to.be.instanceof(User)

                    const { id, name, email, username, password, bio, githubProfile, savedProjects, skills, city } = _user

                    expect(bio).to.be.undefined
                    expect(githubProfile).to.be.undefined
                    expect(savedProjects).to.be.undefined
                    expect(skills).to.be.undefined
                    expect(city).to.be.undefined


                    expect(id).to.exist
                    expect(id).to.be.a('string')
                    expect(id).to.equal(user.id)
                    expect(name).to.equal(user.name)
                    expect(email).to.equal(user.email)
                    expect(username).to.equal(user.username)
                    expect(password).to.be.undefined
                })
            }),

            describe('retrieve additional profile info', () => {
                let user

                beforeEach(async () => {
                    user = new User({ name: 'John', email: 'doe2@gmail.com', username: 'jd', password: '123' })

                    await user.save()
                })

                it('should succeed on valid id', async () => {
                    const _user = await logic.retrieveProfileInfo(user.id)

                    expect(_user).not.to.be.instanceof(User)

                    const { id, name, email, username, password, bio, githubProfile, savedProjects, skills, city } = _user

                    expect(name).to.be.undefined
                    expect(email).to.be.undefined
                    expect(username).to.be.undefined
                    expect(password).to.be.undefined
                    expect(id).to.exist
                    expect(id).to.be.a('string')
                    expect(id).to.equal(user.id)
                    expect(bio).to.equal(user.bio)
                    expect(githubProfile).to.equal(user.githubProfile)
                    expect(JSON.stringify(savedProjects)).to.equal(JSON.stringify(user.savedProjects))
                    expect(JSON.stringify(skills)).to.equal(JSON.stringify(user.skills))
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

        describe('update user profile', () => {
            let user

            beforeEach(() => (user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })).save())

            it('should update on correct data and password', async () => {
                const { id, bio, githubProfile, city, skills } = user

                const newBio = `${bio}-${Math.random()}`
                const newGithubProfile = `${githubProfile}-${Math.random()}`
                const newCity = `${city}-${Math.random()}`
                const newSkills = ['react', 'mongoose', 'javascript']

                const res = await logic.updateProfile(id, newBio, newGithubProfile, newCity, newSkills)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.bio).to.equal(newBio)

                expect(_user.githubProfile).to.equal(newGithubProfile)
                expect(_user.city).to.equal(newCity)
                expect(newSkills.length).to.equal(3)

            })

            it('should update on correct bio (and other fields null)', async () => {
                const { id, bio, githubProfile, city, skills } = user

                const newBio = `${bio}-${Math.random()}`

                const res = await logic.updateProfile(id, newBio, null, null, null)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.bio).to.equal(newBio)

                expect(_user.githubProfile).to.equal(githubProfile)
                expect(_user.city).to.equal(city)
                expect(JSON.stringify(_user.skills)).to.equal(JSON.stringify(skills))

            })

            it('should update on correct githubProfile (and other fields null)', async () => {
                const { id, bio, githubProfile, city, skills } = user

                const newGithubProfile = `${githubProfile}-${Math.random()}`

                const res = await logic.updateProfile(id, bio, newGithubProfile, null, null)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.githubProfile).to.equal(newGithubProfile)

                expect(_user.bio).to.equal(bio)
                expect(_user.city).to.equal(city)
                expect(JSON.stringify(_user.skills)).to.equal(JSON.stringify(skills))

            })

            it('should update on correct city (and other fields null)', async () => {
                const { id, bio, githubProfile, city, skills } = user

                const newCity = `${city}-${Math.random()}`

                const res = await logic.updateProfile(id, bio, githubProfile, newCity, null)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.city).to.equal(newCity)

                expect(_user.bio).to.equal(bio)
                expect(_user.githubProfile).to.equal(githubProfile)
                expect(JSON.stringify(_user.skills)).to.equal(JSON.stringify(skills))

            })



        })

        describe('projects', () => {
            describe('add a project ', () => {
                let user, name, description, skills, beginnerFriendly, maxMembers

                beforeEach(async () => {
                    user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })

                    name = `text-${Math.random()}`
                    description = `text-${Math.random()}`
                    skills = [`text-${Math.random()}`, `text-${Math.random()}`, `text-${Math.random()}`]
                    beginnerFriendly = 'true'
                    maxMembers = `${Math.random()}`

                    await user.save()
                })

                it('should succeed on correct data', async () => {
                    const res = await logic.addNewProject(user.id, name, description, skills, beginnerFriendly, maxMembers)

                    expect(res).to.be.undefined

                    const projects = await Project.find()

                    const [project] = projects

                    expect(project.name).to.equal(name)

                    expect(project.description).to.equal(description)

                    expect(JSON.stringify(project.skills)).to.equal(JSON.stringify(skills))

                    expect(project.beginnerFriendly).to.equal(beginnerFriendly)

                    expect(project.maxMembers).to.equal(maxMembers)
                    expect(project.currentMembers).to.equal(1)

                    expect(project.owner.toString()).to.equal(user.id)
                })

                // TODO other test cases
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

                it('should succeed on listing all projects of owner', async () => {
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

                // TODO other test cases
            })

            describe('retrieve project info', () => {
                let user, project

                beforeEach(async () => {

                    user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })

                    project = new Project({ name: 'test1', description: 'testdescription1', skills: ['react1', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })

                    await user.save()
                    await project.save()
                })

                it('should retrieve information on correct project ID', async () => {
                    const { name, description, skills, beginnerFriendly, maxMembers, owner } = project

                    const _project = await logic.retrieveProjectInfo(project.id)
                    expect(_project.name).to.equal(name)
                    expect(_project.description).to.equal(description)
                    expect(JSON.stringify(_project.skills)).to.equal(JSON.stringify(skills))
                    expect(_project.beginnerFriendly).to.equal(beginnerFriendly)
                    expect(_project.maxMembers).to.equal(maxMembers)
                    expect(_project.currentMembers).to.equal(1)
                    expect(_project.owner.toString()).to.equal(owner.toString())
                })
            })

            describe('Request collaboration', () => {
                let user, user2, project

                beforeEach(async () => {

                    user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })

                    user2 = new User({ name: 'John2', email: 'doe2@gmail.com', username: 'jd2', password: '123' })

                    project = new Project({ name: 'test1', description: 'testdescription1', skills: ['react1', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })

                    await user.save()
                    await user2.save()
                    await project.save()
                })

                it('should add user2 into pending collaborators list', async () => {
                    expect(project.owner.toString()).to.equal(user.id.toString())

                    const res = await logic.requestCollaboration(user2.id, project.id)

                    const _projects = await Project.find()

                    expect(_projects.length).to.equal(1)

                    const [_project] = _projects

                    expect(_project.pendingCollaborators.length).to.equal(1)

                    expect(_project.pendingCollaborators[0].toString()).to.equal(user2.id)

                })

                it('should add collaborators into collaborator array when accepted', async () => {
                    expect(project.owner.toString()).to.equal(user.id.toString())

                    await logic.requestCollaboration(user2.id, project.id)

                    await logic.acceptCollaboration(user.id, user2.id, project.id)

                    const _projects = await Project.find()

                    const [_project] = _projects

                    expect(_project.pendingCollaborators.length).to.equal(0)

                    expect(_project.collaborators.length).to.equal(1)

                    expect(_project.collaborators[0].toString()).to.equal(user2.id)
                    

                })

                it('should remove collaborators from pending collaborators when rejected', async () => {
                    expect(project.owner.toString()).to.equal(user.id.toString())

                    await logic.requestCollaboration(user2.id, project.id)

                    await logic.rejectCollaboration(user.id, user2.id, project.id)

                    const _projects = await Project.find()

                    const [_project] = _projects

                    expect(_project.pendingCollaborators.length).to.equal(0)

                    expect(_project.collaborators.length).to.equal(0)
                    

                })


            })

        })


    })

    afterEach(() => Promise.all([User.deleteMany(), Project.deleteMany(), Meeting.deleteMany()]))

    after(() => mongoose.disconnect())
})