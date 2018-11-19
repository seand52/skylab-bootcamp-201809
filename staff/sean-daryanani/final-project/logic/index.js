const { User, Project, Meeting } = require('../data')
const { AlreadyExistsError, AuthError, NotAllowedError, NotFoundError, ValueError } = require('../errors')
const validate = require('../utils/validate')
const fs = require('fs')
const path = require('path')

const logic = {

    registerUser(name, email, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof email !== 'string') throw TypeError(`${email} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw new ValueError('name is empty or blank')
        if (!email.trim()) throw new ValueError('email is empty or blank')
        if (!username.trim()) throw new ValueError('username is empty or blank')
        if (!password.trim()) throw new ValueError('password is empty or blank')

        return (async () => {
            let user = await User.findOne({ username })

            if (user) throw new AlreadyExistsError(`username ${username} already registered`)

            user = new User({ name, email, username, password })

            await user.save()
        })()
    },

    authenticateUser(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw new ValueError('username is empty or blank')
        if (!password.trim()) throw new ValueError('password is empty or blank')

        return (async () => {
            const user = await User.findOne({ username })

            if (!user || user.password !== password) throw new AuthError('invalid username or password')

            return user.id
        })()
    },

    retrieveUser(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim()) throw new ValueError('id is empty or blank')

        return (async () => {

            const user = await User.findById(id, { '_id': 0, password: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            user.id = id

            return user

        })()
    },

    updateUser(id, name, email, username, newPassword, password) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'name', value: name, type: String, optional: true },
            { key: 'surname', value: email, type: String, optional: true },
            { key: 'username', value: username, type: String, optional: true },
            { key: 'password', value: password, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            if (user.password !== password) throw new AuthError('invalid password')

            if (username) {
                const _user = await User.findOne({ username })

                if (_user) throw new AlreadyExistsError(`username ${username} already exists`)

                name != null && (user.name = name)
                email != null && (user.email = email)
                user.username = username
                newPassword != null && (user.password = newPassword)

                await user.save()
            } else {
                name != null && (user.name = name)
                email != null && (user.email = email)
                newPassword != null && (user.password = newPassword)

                await user.save()
            }
        })()
    },

    updateProfile(id, bio, githubProfile, city, skills) {
        
    }
}

module.exports = logic 