const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Message = new Schema({
    sender : {
        type: ObjectId,
        ref: 'User'
    },
    receiver: {
        type: ObjectId,
        ref: 'User'
    },
    text: {
        type: String
    },
    sent: {
        type: Date
    },
    conversation: {
        type: ObjectId,
        ref: 'Conversation'
    }
})

module.exports = Message