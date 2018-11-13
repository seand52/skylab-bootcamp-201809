const fs = require('fs')
const uid = require('uuid/v4')

class User {
    constructor({ id, name, surname, username, password, postits }) {
        this.id = id || uid()

        this.name = name
        this.surname = surname
        this.username = username
        this.password = password

        this.postits = postits || []
    }

    save() {
        return User._collection.findOne({ id: this.id })
            .then(user => {
                if (user) {
                    return User._collection.updateOne({ id: this.id }, {$set:this})
                } else {
                    return User._collection.insertOne(this)
                }
            })
    }

    toObject() {
        const { name, surname, username, password, postits } = this

        return { name, surname, username, password, postits }
    }

    static findByUsername(username) {
        return User._collection.findOne({username})
            .then(user => {

                return new User(user)
            })


        // return new Promise((resolve, reject) => {
        //     fs.readFile(User._file, (err, json) => {
        //         if (err) return reject(err)

        //         const users = JSON.parse(json)

        //         const user = users.find(user => user.username === username)

        //         resolve(user ? new User(user) : undefined)
        //     })
        // })
    }

    static findById(id) {

        return User._collection.findOne({id})
            .then(user => {
                debugger
                return new User(user)
            })
    }
}

User._collection = 'NO-COLLECTION'

module.exports = User