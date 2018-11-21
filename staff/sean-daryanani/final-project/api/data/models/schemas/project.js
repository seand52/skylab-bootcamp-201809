const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Project = new Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    skills: [{
        type: String,
        required: true
    }],

    created: {
        type: Date,
        default: Date.now,
    },

    onGoing: {
        type: Boolean,
        default: true

    },

    beginnerFriendly: {
        type: String,
        required: true
    },

    maxMembers: {
        type: String,
        required: true
    },

    currentMembers: {
        type: Number,
        default: 1
    },

    collaborators: [{
        type: ObjectId,
        ref: 'User'
    }],

    owner: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },

    pendingCollaborators: [{
        type: ObjectId,
        ref: 'User'
    }],


    projectImage: {
        type: 'string',
        default: 'https://eadb.org/wp-content/uploads/2015/08/profile-placeholder.jpg'
    }
})

module.exports = Project