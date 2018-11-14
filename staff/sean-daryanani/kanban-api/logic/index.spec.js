require('dotenv').config()

const mongoose = require('mongoose')
const { User, Postit } = require('../data')
const logic = require('.')
const { AlreadyExistsError } = require('../errors')

const { expect } = require('chai')

const MONGO_URL = 'mongodb://localhost:27017/postit-test'

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {

    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => Promise.all([User.deleteMany(), Postit.deleteMany()]))

    describe('user', () => {
        describe('register', () => {
            let name, surname, username, password

            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
            })

            it('should succeed on correct data', async () => {
                const res = await logic.registerUser(name, surname, username, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                expect(_users.length).to.equal(1)

                const [user] = _users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.username).to.equal(username)
                expect(user.password).to.equal(password)
            }
            )

            it('should fail on undefined name', () => {
                expect( () => logic.registerUser(undefined, surname, username, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases
        })

        describe('authenticate', () => {

            let user

            beforeEach(() => (user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })).save())

            it('should authenticate on correct credentials', async () => {

                const { username, password } = user
                const id = await logic.authenticateUser(username, password)
                expect(id).to.exist
                expect(id).to.be.a('string')

                const _users = await User.find()
                const [_user] = _users

                expect(_user.id).to.equal(id)


            }
            )

            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases
        })

        describe('retrieve', () => {
            let user, postits

            beforeEach(() => {
                postit = new Postit({ text: 'hello text' })
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', postits: [postit] })

                return user.save()
            })

            it('should succeed on valid id', async () => {
                const _user = await logic.retrieveUser(user.id)
                const { id, name, surname, username, password, postits } = _user
                expect(_user).to.not.be.instanceof(User)
                expect(id).to.exist
                expect(id).to.equal(_user.id)
                expect(name).to.equal(_user.name)
                expect(surname).to.equal(_user.surname)
                expect(username).to.equal(_user.username)
                expect(password).to.be.undefined
                expect(postits).not.to.exist

            }
            )
        })

        describe('retrieve friends list', () => {
            let user1, user2, user3, user4

            beforeEach(() => {
                user1 = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123'})
                user2 = new User({ name: 'John2', surname: 'Doe2', username: 'jd2', password: '123'})
                user3 = new User({ name: 'John3', surname: 'Doe3', username: 'jd3', password: '123'})
                user4 = new User({ name: 'John4', surname: 'Doe4', username: 'jd4', password: '123', friends:[user1.id, user2.id, user3.id]})

                return Promise.all([user1.save(), user2.save(), user3.save(), user4.save()])
            })

            it('should succeed on valid id', async () => {
                const friends = await logic.retrieveFriends(user4.id)

                expect(friends.length).to.equal(3)

                // const { id, name, surname, username, password, postits } = _user

            }
            )
        })

        describe('add friend', () => {
            let user1, user2

            beforeEach(() => {
                user1 = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', friends: [] })
                user2 = new User({ name: 'Pepito', surname: 'Pepito', username: 'u', password: 'p', friends:[] })


                return user1.save()
                    .then(() => user2.save())
            })

            it('should add friend on correct username', async () => {
                
                await logic.addFriend(user1.id, user2.username)

                const _users = await User.find({username: user1.username})

                const [_user] = _users

                const {friends} = _user

                expect(friends[0].toString()).to.equal(user2.id)                
            }
            )
        })

        describe('remove friend', () => {
            let user1, user2

            beforeEach(() => {
                user1 = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', friends: [] })
                user2 = new User({ name: 'Pepito', surname: 'Pepito', username: 'u', password: 'p', friends:[] })
                
                return (async () => {

                    await user1.save()
                    await user2.save()
                    await logic.addFriend(user1.id, user2.username) 
 
                })()    
    
                   
            })

            it('should add friend on correct username', async () => {
                
                await logic.removeFriend(user1.id, user2.username)

                // const _users = await User.find({username: user1.username})

                // const [_user] = _users

                // const {friends} = _user

                // expect(friends[0].toString()).to.equal(user2.id)                
            }
            )
        })

        describe('update', () => {
            let user

            beforeEach(() => (user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })).save())

            it('should update on correct data and password', async () => {

                const { id, name, surname, username, password } = user
                const newName = `${name}-${Math.random()}`
                const newSurname = `${surname}-${Math.random()}`
                const newUsername = `${username}-${Math.random()}`
                const newPassword = `${password}-${Math.random()}`

                await logic.updateUser(id, newName, newSurname, newUsername, newPassword, password)

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(newSurname)
                expect(_user.username).to.equal(newUsername)
                expect(_user.password).to.equal(newPassword)

            })

            it('should update on correct id, name and password (other fields null)', async () => {
                const { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`

                await logic.updateUser(id, newName, null, null, null, password)

                const _users = await User.find()
                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(surname)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })


            // TODO other combinations of valid updates

            it('should fail on undefined id', () => {
                const { id, name, surname, username, password } = user

                expect(() => logic.updateUser(undefined, name, surname, username, password, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases

            describe('with existing user', () => {
                let user, user2

                beforeEach(() => {
                    user2 = new User({ name: 'John2', surname: 'Doe2', username: 'jd2', password: '123' })

                    return user2.save()

                })

                it('should update on correct data and password', () => {
                    const { id, name, surname, username, password } = user2

                    const newUsername = 'jd'

                    return logic.updateUser(id, null, null, newUsername, null, password)
                        .then(() => expect(true).to.be.false)
                        .catch(err => {
                            expect(err).to.be.instanceof(AlreadyExistsError)

                            return User.findById(id)
                        })
                        .then(_user => {
                            expect(_user.id).to.equal(id)

                            expect(_user.name).to.equal(name)
                            expect(_user.surname).to.equal(surname)
                            expect(_user.username).to.equal(username)
                            expect(_user.password).to.equal(password)
                        })
                })
            })
        })
    })

    describe('postits', () => {
        describe('add', () => {
            let user, text, status

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                text = `text-${Math.random()}`
                status = 'TODO'
                return user.save()
            })

            it('should succeed on correct data', async () => {
                await logic.addPostit(user.id, text, status)

                const _postits = await Postit.find()
                const [_postit] = _postits

                expect(_postit.text).to.equal(text)

                expect(_postit.status).to.equal(status)

                expect(_postit.user.toString()).to.equal(user.id)
            }
            )

            // TODO other test cases
        })

        describe('list', () => {
            let user, user2, postit, postit2

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                user2 = new User({ name: 'John2', surname: 'Doe2', username: 'jd2', password: '123' })

                postit = new Postit({ text: 'hello text', status: 'TODO', user: user.id })

                postit2 = new Postit({ text: 'hello text 2', status: 'TODO', user: user2.id, assignedTo:[user.id] })

                return user.save()
                    .then(() => postit.save())
                    .then(() => postit2.save())
            })

            it('should succeed on correct data', async () => {

                const postits = await logic.listPostits(user.id)

                const _postits = await Postit.find()

                expect(_postits.length).to.equal(2)

                expect(postits.length).to.equal(_postits.length)

                const [_postit, _postit2] = _postits
                expect(_postit2.assignedTo[0].toString()).to.equal(user.id)
                expect(_postits[0].id).to.equal(postit.id)
                expect(_postit.text).to.equal(postit.text)

                expect(_postit2.id).to.equal(postit2.id)
                expect(_postit2.text).to.equal(postit2.text)

                const [__postit, __postit2] = postits

                expect(__postit).not.to.be.instanceof(Postit)
                expect(__postit2).not.to.be.instanceof(Postit)

                expect(_postit.id).to.equal(__postit.id)
                expect(_postit.text).to.equal(__postit.text)

                expect(_postit2.id).to.equal(__postit2.id)
                expect(_postit2.text).to.equal(__postit2.text)



            }
            )
        })

        describe('remove', () => {
            let user, postit

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                postit = new Postit({ text: 'hello text', status: 'TODO', user: user.id })

                return user.save()
                    .then(() => postit.save())
            })

            it('should succeed on correct data', async () => {
                await logic.removePostit(user.id, postit.id)

                const _users = await User.find()

                expect(_users.length).to.equal(1)

                const [_user] = _users

                expect(_user.id).to.equal(user.id)

                const _postits = await Postit.find()

                expect(_postits.length).to.equal(0)



            }
            )
        })

        describe('assign postit', () => {
            let user1, user2, postit

            beforeEach(() => {
                user1 = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', friends: [] })
                user2 = new User({ name: 'Pepito', surname: 'Pepito', username: 'u', password: 'p', friends:[] })
                postit = new Postit({ text: 'hello text', status: 'TODO', user: user1.id, assignedTo:[] })

                return user1.save()
                    .then(() => postit.save())
                    .then(() => user2.save())
            })

            it('should assign postit if friend exists', async () => {
                
                await logic.assignPostit(user1.id, postit.id, user2.username)

                const postits = await Postit.findOne({user: user1.id})

                expect(postits.assignedTo[0].toString()).to.equal(user2.id)

            }
            )
        })

        describe('modify', () => {
            let user, postit, newText, newstatus

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                postit = new Postit({ text: 'hello text', status: 'TODO', user: user.id })

                newText = `new-text-${Math.random()}`
                newstatus = 'DOING'

                return user.save()
                    .then(() => postit.save())
            })

            it('should succeed on correct data', async () => {

                await logic.modifyPostit(user.id, postit.id, newText, newstatus)

                const _users = await User.find()

                expect(_users.length).to.equal(1)

                const [_user] = _users

                expect(_user.id).to.equal(user.id)

                const postits = await Postit.find()

                expect(postits.length).to.equal(1)

                const [_postit] = postits

                expect(_postit.text).to.equal(newText)

                expect(_postit.status).to.equal(newstatus)


            }
            )
        })

    })

    after(() => mongoose.disconnect())
})