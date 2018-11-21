const mongoose = require('mongoose')
const User = require('./models/schemas/user')
const Project = require('./models/schemas/project')
const Meeting = require('./models/schemas/meeting')

module.exports = {
    User: mongoose.model('User', User),
    Project: mongoose.model('Project', Project),
    Meeting: mongoose.model('Event', Meeting)
}