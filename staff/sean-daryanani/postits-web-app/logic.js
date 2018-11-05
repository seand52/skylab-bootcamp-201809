const {
    User,
    Postit
} = require('./data')

const logic = {
    registerUser(name, surname, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw Error('name is empty or blank')
        if (!surname.trim()) throw Error('surname is empty or blank')
        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return User.findByUsername(username)
            .then(user => {
                if (user) throw Error(`username ${username} already registered`)

                user = new User({name, surname, username, password})

                return user.save()
            })


    },

    authenticateUser(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return User.findByUsername(username)
            .then(user => {

                if (!user || user.password !== password) throw Error('invalid username or password')

                return user.id

            })

    },

    retrieveUser(id) {
        if (typeof id !== 'number') throw TypeError(`${id} is not a number`)

        return User.findById(id)
            .then(user => {
                if (!user) throw Error(`user with id ${id} not found`)

                const _user = user.toObject()

                _user.id = user.id
                _user.postits = user.postits
                // delete _user.password

                return _user
            })


    },

    createPostit(id, text) {

        if (typeof id !== 'number') throw TypeError(`${id} is not a number`)

        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

        if (!text.trim().length) throw Error('text is empty or blank')

        return User.findById(id)
            .then(user => {
                if (!user) throw Error(`user with id ${id} not found`)

                const postit = new Postit({text})
                
                user.postits.push(postit)

               return user.save()
            })
    },

    deletePostit(userId, postitId) {

        return User.findById(userId) 
            .then(user => {
                if (!user) throw Error(`user with id ${userId} not found`)

                user.postits = user.postits.filter(item => item.id !== Number(postitId))
        
                return user.save()
            })
    },

    editPostit(userId, postitId, newText) {
        return User.findById(userId)

            .then(user => {

                const {postits} = user

                const postit = postits.find(item => Number(item.id) === Number(postitId))


                postit.text = newText

                return user.save()

            })
    }

}

module.exports = logic