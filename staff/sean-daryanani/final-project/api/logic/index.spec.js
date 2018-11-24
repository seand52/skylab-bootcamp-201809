const { mongoose, models: { User, Project, Meeting } } = require('data')
const logic = require('.')
const fs = require('fs')
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

            // it('should insert a photo into a profile)', async () => {

            //     const { profileImage } = user

            //     expect(profileImage).to.equal('https://eadb.org/wp-content/uploads/2015/08/profile-placeholder.jpg')

            //     const newPhoto = 'iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAA4VBMVEX///8DWoC0tLQAVX3q7vEASnbwklexsbHW1tbJv7oFTnmPoqmswMx8nrIDXIH9mVK0hmALUobwkFL1vJ33xqzg4OCwtru2s7D0kE/ykVQAUXkARHAAQW4AU3sAOWgAMmPL2eH0+Prk7fFNc5DU4eeLrL4AMmW+0tybscHd6e7uhET/+/kgXIBwlKv63MnviEh2l602d5ZKf5ymwM4kaItghJ+0z9pAZoeTucksVXo+a4qhuMZoiaF0oLa2yNJKgZ3QtqF+mrb0sYvxmGLMvrZ+qbzyp334zbbynmrtfzj859x4D9NwAAAIxUlEQVR4nO2ca2ObOBaGYYkys9pYu+N2Oy0CDLYJtoNjJzF247jubLpNJv3/P2jQpOUigS0IELuc91sIEvCgy3ukgxUFBAKBQCAQCAQCgUAgEAgEAoFAIFBlunybq1+PTCdlGbyZvc9Udzb7/d0vR6X/lmbQPc3Wh/e/v/vHUQkYVMJgNpnMZpNZixl0n7r3j5eXb/58mrWVQXfy5uL5wOWXp3Yy6J5eRkcuHiatZDC7TBy6eJi1kMHTferYZfdDCxl8Sx27uJ+1jsHsC3fwcdI6Bk8P3MHLFjK45w62kMEE2sHp7JQ7+LZ9DIR54aF988LphPMHsxb6g9PJY7IZfGmjTzz98PR4ESHotjNeCEPnh28XIYaLb4/vJ+2MG8NHnnQf3rx9e/9l9r6t6wesKcyYoj9byQDWE4+fwQvW1v+dq///87hUmsEf/8nVv45Mv5Zl8L/fcoWPS+isLIOOpv4k0oABMFCBARMwAAZMwAAYMAEDYMAEDIABEzAABkzAABgwAQNgwAQMgAETMAAGTMfDgNRW8/EwoKiumo+GAfp6ZdF6qj4SBoQuFMULMKrjokfCQDW27Jre3Ed65QPDkTDAi+/f3w1Hi8qveyQM6Ci67ker6sqPg4G+Gv64rONX3hmOgwHqxM3AaOl4cOtFzSDArWRA6Ofoqks964SXYXktBggXOLkXN4Op6BZJscpEvQoDDd26U+mhjaBFdFHbNMVi+tf5iyi8AgOCjcBWxqusVp0p6ya+qGiXCQ0cZ7sytNId4hUYWOYdMzw3luRNYxL9PoGjieA0Yxz+Z9yhtCyExhlgazp+ruBKcpZL+CM3g1vPff6ffWWVfCsNMzDRIGrYfSzTG4juR/5IUcVuT69iQj4t1SGaZEBU6rv9uIY7Q6YU6jg/CmR0H1O34wqHc1xmbGyQAcHW9dBJ1HASSCyLaCl/JPwbucl7cjzfKt4UG'


            //     await logic.insertPhoto(user.id, newPhoto)

            //     const _users= User.find()

            //     const [_user] = _users

            //     expect(_user.profileImage).to.equal(newPhoto)

            // })



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

            describe('delete a project and associated meeings', () => {
                let user, project, meeting1, meeting2, meeting3

                beforeEach(async () => {
                    user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })
                    project = new Project({ name: 'test1', description: 'testdescription1', skills: ['react1', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })
                    meeting1 = new Meeting({ project: project.id, date: Date.now(), location: 'madrid' })
                    meeting2 = new Meeting({ project: project.id, date: Date.now(), location: 'madrid' })
                    meeting3 = new Meeting({ project: project.id, date: Date.now(), location: 'madrid' })
                    
                    await user.save()
                    await project.save()
                    await meeting1.save()
                    await meeting2.save()
                    await meeting3.save()

                })

                it('should succeed on correct data', async () => {

                    await logic.deleteProject(user.id, project.id)

                    const _project = await Project.findById(project.id)

                    const _meetings = await Meeting.find({ project: project.id })

                    expect(_project).to.equal(null)

                    expect(_meetings.length).to.equal(0)





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

                    await logic.saveProject(user.id, project.id)

                    const _user = await User.findById(user.id)

                    expect(_user.savedProjects.length).to.equal(1)

                    expect(_user.savedProjects[0].toString()).to.equal(project.id)



                })


                it('should succeed on listing saved projects', async () => {
                    project2 = new Project({ name: 'test1', description: 'testdescription1', skills: ['react1', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user2.id })
                    project3 = new Project({ name: 'test1', description: 'testdescription1', skills: ['react1', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user2.id })

                    await project2.save()
                    await project3.save()
                    const { name, description, skills, beginnerFriendly, maxMembers, owner } = project

                    await logic.saveProject(user.id, project.id)
                    await logic.saveProject(user.id, project3.id)

                    const projects = await logic.listSavedProjects(user.id)

                    expect(projects.length).to.equal(2)

                    expect(projects.name).to.equal





                })

                // TODO other test cases
            })

            describe('leave a project (stop being collaborator)', () => {
                let user, user2, project

                beforeEach(async () => {
                    user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })
                    user2 = new User({ name: 'John2', email: 'doe2@gmail.com', username: 'jd2', password: '123' })
                    project = new Project({ name: 'test1', description: 'testdescription1', skills: ['react1', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id, collaborators:[user2.id] })

                    await user.save()
                    await user2.save()
                    await project.save()
                })

                it('should succeed on correct data', async () => {

                    await logic.leaveProject(user2.id, project.id)

                    const _project = await Project.findById(project.id)

                    expect(_project.collaborators.length).to.equal(0)
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

            describe('query projects', () => {
                let user, project, project2, project3, project4, project5
                beforeEach(async () => {
                    user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })

                    project = new Project({ name: 'react', description: 'testdescription1', skills: ['react', 'mongoose', 'javascript'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })

                    project2 = new Project({ name: 'reach', description: 'testdescription2', skills: ['mongoose', 'javascript'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })

                    project3 = new Project({ name: 'mongoose', description: 'testdescription3', skills: ['react', 'javascript'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })

                    project4 = new Project({ name: 'rpo', description: 'testdescription4', skills: ['mongoose', 'javascript'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })

                    project5 = new Project({ name: 'oterea', description: 'testdescription5', skills: ['react', 'mongoose', 'javascript'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })

                    await user.save()
                    await project.save()
                    await project2.save()
                    await project3.save()
                    await project4.save()
                    await project5.save()
                })

                it('should successfuly query for projects based on a skill', async () => {

                    const query = 'rea'

                    const projects = await logic.searchProjects(query)

                    expect(projects.length).to.equal(3)

                    const [_project1, _project2, _project3] = projects
                })

                it('should successfuly filter results based on skills', async () => {

                    const arr = ['react', 'mongoose']

                    const projects = await logic.filterProjects(arr)

                    expect(projects.length).to.equal(2)

                    const [_project1, _project2, _project3] = projects
                })
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

                    const decision = 'accept'

                    expect(project.owner.toString()).to.equal(user.id.toString())

                    await logic.requestCollaboration(user2.id, project.id)

                    await logic.handleCollaboration(user.id, user2.id, project.id, decision)

                    const _projects = await Project.find()

                    const [_project] = _projects

                    expect(_project.pendingCollaborators.length).to.equal(0)

                    expect(_project.collaborators.length).to.equal(1)

                    expect(_project.collaborators[0].toString()).to.equal(user2.id)


                })

                it('should remove collaborators from pending collaborators when rejected', async () => {

                    const decision = 'reject'

                    expect(project.owner.toString()).to.equal(user.id.toString())

                    await logic.requestCollaboration(user2.id, project.id)

                    await logic.handleCollaboration(user.id, user2.id, project.id, 'reject')

                    const _projects = await Project.find()

                    const [_project] = _projects

                    expect(_project.pendingCollaborators.length).to.equal(0)

                    expect(_project.collaborators.length).to.equal(0)


                })


            })

        })




    })

    describe('meetings', () => {
        describe('add a new meeting ', () => {
            let user, project

            beforeEach(async () => {
                user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '123' })

                project = new Project({ name: 'test1', description: 'testdescription1', skills: ['react1', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })



                await user.save()
                await project.save()
            })

            it('should succeed on correct data', async () => {
                const date = Date.now()

                await logic.addMeeting(user.id, project.id, date, 'barcelona')

                const meetings = await Meeting.find()

                expect(meetings.length).to.equal(1)

                const [_meeting] = meetings

                expect(_meeting.project.toString()).to.equal(project.id)


                expect(_meeting.location).to.equal('barcelona')


            })

            it('should succeed on deleting event', async () => {
                const date = Date.now()

                await logic.addMeeting(user.id, project.id, date, 'barcelona')

                const meetings = await Meeting.find()

                expect(meetings.length).to.equal(1)

                const [_meeting] = meetings

                expect(_meeting.project.toString()).to.equal(project.id)


                expect(_meeting.location).to.equal('barcelona')

                await logic.deleteMeeting(_meeting.id)

                const _meetings = await Meeting.find()

                expect(_meetings.length).to.equal(0)



            })

            describe('list meetings ', () => {
                let project2, meeting1, meeting2, meeting3

                beforeEach(async () => {

                    project2 = new Project({ name: 'test12', description: 'testdescription12', skills: ['react12', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })

                    meeting1 = new Meeting({ project: project.id, attending: [user.id], date: Date.now(), location: 'barcelona' })

                    meeting2 = new Meeting({ project: project.id, date: Date.now(), location: 'madrid' })

                    meeting3 = new Meeting({ project: project2.id, date: Date.now(), location: 'bilbao' })




                    await user.save()
                    await project.save()
                    await meeting1.save()
                    await meeting2.save()
                    await meeting3.save()
                })

                it('should succeed on listing all relevant meetings for a given project', async () => {

                    const meetings = await logic.listProjectMeetings(project.id)

                    expect(meetings.length).to.equal(2)

                    const [_meeting, _meeting2] = meetings

                    expect(_meeting.project.toString()).to.equal(project.id)


                    expect(_meeting.location).to.equal('barcelona')

                    expect(_meeting2.project.toString()).to.equal(project.id)


                    expect(_meeting2.location).to.equal('madrid')


                })

                it('should retrieve information on a specific meeting', async () => {

                    const meeting = await logic.retrieveMeetingInfo(meeting1.id)


                    expect(meeting.project.toString()).to.equal(project.id)


                    expect(meeting.location).to.equal('barcelona')

                    expect(typeof meeting.attending[0].id).to.equal('string')


                })

            })

            describe('attend meeting ', () => {
                let user2, meeting1, meeting2, meeting3

                beforeEach(async () => {

                    user2 = new User({ name: 'John2', email: 'doe2@gmail.com', username: 'jd2', password: '1232' })

                    project2 = new Project({ name: 'test12', description: 'testdescription12', skills: ['react12', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id, collaborators: [user2.id] })

                    meeting1 = new Meeting({ project: project.id, date: Date.now(), location: 'barcelona' })

                    meeting2 = new Meeting({ project: project.id, date: Date.now(), location: 'madrid' })

                    await user2.save()
                    await project2.save()
                    await meeting1.save()
                    await meeting2.save()
                })

                it('should succeed on correct data', async () => {

                    await logic.attendMeeting(user2.id, meeting1.id)

                    const meeting = await Meeting.findById(meeting1.id)

                    expect(meeting.attending.length).to.equal(1)

                    expect(meeting.attending[0].toString()).to.equal(user2.id)


                })

            })

            describe('unattend meeting ', () => {
                let user2, meeting1, meeting2

                beforeEach(async () => {

                    user2 = new User({ name: 'John2', email: 'doe2@gmail.com', username: 'jd2', password: '1232' })

                    project2 = new Project({ name: 'test12', description: 'testdescription12', skills: ['react12', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id, collaborators: [user2.id] })

                    meeting1 = new Meeting({ project: project.id, date: Date.now(), location: 'barcelona', attending:[user2.id] })

                    meeting2 = new Meeting({ project: project.id, date: Date.now(), location: 'madrid' })

                    await user2.save()
                    await project2.save()
                    await meeting1.save()
                    await meeting2.save()
                })

                it('should succeed on correct data', async () => {

                    await logic.unAttendMeeting(user2.id, meeting1.id)

                    const meeting = await Meeting.findById(meeting1.id)

                    expect(meeting.attending.length).to.equal(0)




                })

            })
            // TODO other test cases
        })

        describe('list upcoming meetings for a user ', () => {
            let user, user2, project, project2, meeting1, meeting2, meeting3

            beforeEach(async () => {

                user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '1232' })

                user2 = new User({ name: 'John2', email: 'doe2@gmail.com', username: 'jd2', password: '1232' })

                project = new Project({ name: 'test12', description: 'testdescription12', skills: ['react12', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })

                project2 = new Project({ name: 'test12', description: 'testdescription12', skills: ['react12', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user2.id })

                meeting1 = new Meeting({ project: project.id, date: Date.now(), location: 'barcelona', attending: [user2.id] })
                meeting2 = new Meeting({ project: project.id, date: Date.now(), location: 'madrid', attending: [user.id] })
                meeting3 = new Meeting({ project: project.id, date: Date.now(), location: 'bilbao', attending: [user2.id] })

                await user.save()
                await user2.save()
                await project.save()
                await project2.save()
                await meeting1.save()
                await meeting2.save()
                await meeting3.save()
            })

            it('should succeed on correct data', async () => {

                const meetings = await logic.userUpcomingMeetings(user2.id)

                expect(meetings.length).to.equal(2)

                const [_meeting1, _meeting2] = meetings

                expect(_meeting1.location).to.equal('barcelona')
                expect(_meeting2.location).to.equal('bilbao')

            })

        })
        describe('photo ', () => {
            let user, user2, project, project2, meeting1, meeting2, meeting3

            beforeEach(async () => {

                user = new User({ name: 'John', email: 'doe@gmail.com', username: 'jd', password: '1232' })

                await user.save()
            })

            it('should succeed on correct data', async () => {
                let image = './data/images/download.png'

                var file = fs.createReadStream(image)


                await logic.insertProfileImage(user.id, file)

                const _user = await User.findById(user.id)

                expect(_user.insertProfileImage).not.to.equal('https://eadb.org/wp-content/uploads/2015/08/profile-placeholder.jpg')

            })

            it('should succeed on correct data', async () => {
                const project = new Project({ name: 'test12', description: 'testdescription12', skills: ['react12', 'mongoose1', 'javascript1'], beginnerFriendly: 'true', maxMembers: '5', owner: user.id })

                await project.save()
                let image = './data/images/download.png'

                var file = fs.createReadStream(image)


                await logic.insertProjectImage(project.id, file)

                const _user = await User.findById(user.id)

                // expect(_user.insertProfileImage).not.to.equal('https://eadb.org/wp-content/uploads/2015/08/profile-placeholder.jpg')

            })

        })
    })

    afterEach(() => Promise.all([User.deleteMany(), Project.deleteMany(), Meeting.deleteMany()]))

    after(() => mongoose.disconnect())
})