const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Conversation = new Schema({
    members: [{
        type: ObjectId,
        ref: 'User'
    }],

    created: {
        type: Date,
        default: Date.now()
    }
})

module.exports = Conversation