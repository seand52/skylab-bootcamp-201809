const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Conversation = new Schema({
    members: [{
        type: ObjectId,
        ref: 'User'
    }],

    created: {
        type: Date
    }
})

module.exports = Conversation