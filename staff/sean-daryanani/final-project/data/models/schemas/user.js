const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const User = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@“]+(\.[^<>()\[\]\\.,;:\s@“]+)*)|(“.+“))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique: true
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

    joinDate: {
        type: Date,
        default: Date.now
    },

    bio: {
        type: String,
        default: 'Bio is empty'
    },

    githubProfile: {
        type: String,
        default: 'Github profile is empty'
    },

    skills: [{
        type: String
    }],

    savedProjects: [{
        type: ObjectId,
        ref: 'Project'
    }],

    city: {
        type: 'String',
        default: 'City is empty'
    }
    
})

module.exports = User