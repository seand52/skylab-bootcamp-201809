const { Schema, SchemaTypes: {ObjectId} } = require('mongoose')

const Postit = new Schema({
    text: {
        type: String,
        required: true
    },

    status: {
        type:String,
        required:true
    },
    user: {
        type: ObjectId,
        ref:'User',
        required: true
    },  

    assignedTo: {
        type: [ObjectId],
        ref: 'User'
    },

})

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    friends: {
        type: [ObjectId],
        ref: 'User'
    },
    imagePath: {
        type: String,
    }
})

module.exports = {
    Postit,
    User
}