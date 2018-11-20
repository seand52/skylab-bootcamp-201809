const { User, Project, Meeting } = require('../data')
const { AlreadyExistsError, AuthError, NotAllowedError, NotFoundError, ValueError } = require('../errors')
const validate = require('../utils/validate')
const fs = require('fs')
const path = require('path')

const logic = {
    /**
     * Register User
     * @param {string} name 
     * @param {string} email 
     * @param {string} username 
     * @param {string} password 
     * 
     */
    registerUser(name, email, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof email !== 'string') throw TypeError(`${email} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw new ValueError('name is empty or blank')
        if (!email.trim()) throw new ValueError('email is empty or blank')
        if (!username.trim()) throw new ValueError('username is empty or blank')
        if (!password.trim()) throw new ValueError('password is empty or blank')

        return (async () => {
            let user = await User.findOne({ username })

            if (user) throw new AlreadyExistsError(`username ${username} already registered`)

            user = new User({ name, email, username, password })

            await user.save()
        })()
    },
    /**
     * Authenticate User
     * @param {string} username 
     * @param {string} password
     * @returns {Promise <string>}
     */
    authenticateUser(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw new ValueError('username is empty or blank')
        if (!password.trim()) throw new ValueError('password is empty or blank')

        return (async () => {
            const user = await User.findOne({ username })

            if (!user || user.password !== password) throw new AuthError('invalid username or password')

            return user.id
        })()
    },
    /**
     * Retrieve basic user information
     * @param {string} id 
     * @returns {Promise <object>}
     */
    retrieveUser(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim()) throw new ValueError('id is empty or blank')

        return (async () => {

            const user = await User.findById(id, { '_id': 0, password: 0, joinDate: 0, bio: 0, githubProfile: 0, skills: 0, savedProjects: 0, city: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            user.id = id

            return user

        })()
    },

    /**
     * Retrieve profile related information
     * @param {string} id 
     * @returns {Promise <object>}
     */
    retrieveProfileInfo(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim()) throw new ValueError('id is empty or blank')

        return (async () => {

            const user = await User.findById(id, { '_id': 0, password: 0, name: 0, email: 0, username: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            user.id = id

            return user

        })()
    },
    /**
     * Update basic user information
     * @param {string} id 
     * @param {string} name 
     * @param {string} email 
     * @param {string} username 
     * @param {string} newPassword
     * @param {string} password
     */
    updateUser(id, name, email, username, newPassword, password) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'name', value: name, type: String, optional: true },
            { key: 'surname', value: email, type: String, optional: true },
            { key: 'username', value: username, type: String, optional: true },
            { key: 'password', value: password, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            if (user.password !== password) throw new AuthError('invalid password')

            if (username) {
                const _user = await User.findOne({ username })

                if (_user) throw new AlreadyExistsError(`username ${username} already exists`)

                name != null && (user.name = name)
                email != null && (user.email = email)
                user.username = username
                newPassword != null && (user.password = newPassword)

                await user.save()
            } else {
                name != null && (user.name = name)
                email != null && (user.email = email)
                newPassword != null && (user.password = newPassword)

                await user.save()
            }
        })()
    },
    /**
     * Update user Profile info
     * @param {string} id 
     * @param {string} bio 
     * @param {string} githubProfile 
     * @param {string} city 
     * @param {Array} skills 
     */
    updateProfile(id, bio, githubProfile, city, skills) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'bio', value: bio, type: String, optional: true },
            { key: 'githubProfile', value: githubProfile, type: String, optional: true },
            { key: 'city', value: city, type: String, optional: true },
            { key: 'skills', value: skills, type: Array, optional: true }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            bio != null && (user.bio = bio)
            githubProfile != null && (user.githubProfile = githubProfile)
            city != null && (user.city = city)
            skills != null && (user.skills = skills)

            await user.save()
        }
        )()

    },
    /**
     * Add a new project
     * @param {string}id 
     * @param {string}name 
     * @param {string}description 
     * @param {Array}skills 
     * @param {string}beginnerFriendly 
     * @param {string}maxMembers 
     */
    addNewProject(id, name, description, skills, beginnerFriendly, maxMembers) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof description !== 'string') throw TypeError(`${description} is not a string`)
        if (!(skills instanceof Array)) throw TypeError(`${skill} is not an array`)
        if (typeof beginnerFriendly !== 'string') throw TypeError(`${beginnerFriendly} is not a string`)
        if (typeof maxMembers !== 'string') throw TypeError(`${maxMembers} is not a string`)

        if (!id.trim()) throw new ValueError('id is empty or blank')
        if (!name.trim()) throw new ValueError('name is empty or blank')
        if (!description.trim()) throw new ValueError('description is empty or blank')
        if (!beginnerFriendly.trim()) throw new ValueError('beginnerFriendly is empty or blank')
        if (!maxMembers.trim()) throw new ValueError('maxMembers is empty or blank')

        return (async () => {

            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const project = new Project({ name, description, skills, beginnerFriendly, maxMembers, owner: user.id })

            await project.save()
        })()
    },

    /**
 * List projects that belong to user
 * @param {string}id 
 * @returns {Promise <Object>}
 */
    listOwnProjects(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim()) throw new ValueError('id is empty or blank')

        return (async () => {

            const user = await User.findById(id).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            projects = await Project.find({ owner: user._id }).lean()


            projects.forEach(project => {
                project.id = project._id.toString()

                delete project._id

                project.owner = project.owner.toString()

                return project
            })

            return projects

        })()
    },
    /**
     * 
     * @param {string} projectId 
     * @returns {Promise <Object>}
     */
    retrieveProjectInfo(projectId) {
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)
        if (!projectId.trim()) throw new ValueError('projectId is empty or blank')

        return (async () => {

            const project = await Project.findById(projectId)

            if (!project) throw new NotFoundError(`project with id ${projectId} not found`)

            return project

        })()
    },

    requestCollaboration(id, projectId) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)

        if (!id.trim()) throw new ValueError('id is empty or blank')
        if (!projectId.trim()) throw new ValueError('projectId is empty or blank')

        return (async () => {

            const user = await User.findById(id)

            await Project.updateOne({ _id: projectId }, { $push: { pendingCollaborators: user._id } })

        })()
    },

    acceptCollaboration(id, collabId, projectId) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)

        if (!id.trim()) throw new ValueError('id is empty or blank')
        if (!projectId.trim()) throw new ValueError('projectId is empty or blank')

        return (async () => {

            const project = await Project.findById(projectId)

            const collab = await User.findById(collabId)

            if (id !== project.owner.toString()) throw Error('not the owner of the project')

            await Project.updateOne(
                { _id: projectId },
                {
                    $pull: { pendingCollaborators: collab.id },
                    $push: { collaborators: collab.id } 
                }
            )


        })()
    },

    rejectCollaboration(id, collabId, projectId) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)

        if (!id.trim()) throw new ValueError('id is empty or blank')
        if (!projectId.trim()) throw new ValueError('projectId is empty or blank')

        return (async () => {

            const project = await Project.findById(projectId)

            const collab = await User.findById(collabId)

            if (id !== project.owner.toString()) throw Error('not the owner of the project')

            await Project.updateOne(
                { _id: projectId },
                {
                    $pull: { pendingCollaborators: collab.id },
                }
            )


        })()
    }

}

module.exports = logic 