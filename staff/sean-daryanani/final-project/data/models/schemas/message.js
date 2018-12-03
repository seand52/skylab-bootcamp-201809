const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Message = new Schema({
    sender : {
        type: ObjectId,
        ref: 'User',
        required:true
    },
    receiver: {
        type: ObjectId,
        ref: 'User',
        required:true
    },
    text: {
        type: String,

    },
    sent: {
        type: Date,
        default: Date.now()
    },
    conversation: {
        type: ObjectId,
        ref: 'Conversation',
        required:true
    }
})

module.exports = Message