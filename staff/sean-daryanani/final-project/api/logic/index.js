const { models: { User, Project, Meeting } } = require('data')
const { AlreadyExistsError, AuthError, NotAllowedError, NotFoundError, ValueError } = require('../errors')
const validate = require('../utils/validate')
const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: 'dql7wn1ej',
    api_key: '853219916242289',
    api_secret: 'xHAmRRBTudticrVV4h0K1sXPVpg'
})

const logic = {

    /**
     * Upload an image to cloudinary 
     * @param {string} base64Image 
     */
    _saveImage(base64Image) {
        return Promise.resolve().then(() => {
            if (typeof base64Image !== 'string') throw new LogicError('base64Image is not a string')

            return new Promise((resolve, reject) => {
                return cloudinary.v2.uploader.upload(base64Image, function (err, data) {
                    if (err) return reject(err)

                    resolve(data.url)
                })
            })
        })
    },


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

            const user = await User.findById(id, { '_id': 0, password: 0, email: 0, username: 0, __v: 0 }).lean()

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

    deleteProject(userId, projectId) {
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)
        if (!projectId.trim()) throw new ValueError('projectId is empty or blank')


        return (async () => {

            const project = await Project.findById(projectId)

            if (project.owner.toString() !== userId) throw Error ('only project owner can delete a project')

            await project.remove()

            await Meeting.deleteMany({ project: projectId })




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

            let projects = await Project.find({ owner: user._id }).lean()


            projects.forEach(project => {
                project.id = project._id.toString()

                delete project._id
                delete project.__v

                project.owner = project.owner.toString()

                return project
            })

            return projects

        })()
    },

    /**
     * List all projects where the user is a collaborator
     * @param {string} id 
     * @returns {Promise <Object>}
     */
    listCollaboratingProjects(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim()) throw new ValueError('id is empty or blank')

        return (async () => {
            const user = await User.findById(id).lean()

            let projects = await Project.find({ collaborators: user._id }).lean()

            projects.forEach(project => {
                project.id = project._id.toString()

                delete project._id

                delete project.__v

                project.owner = project.owner.toString()

                return project
            })

            return projects

        })()
    },

    /**
     * 
     * @param {string} id 
     * @param {string} projectId 
     */
    saveProject(id, projectId) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)

        if (!id.trim()) throw new ValueError('id is empty or blank')
        if (!projectId.trim()) throw new ValueError('projectId is empty or blank')

        return (async () => {

            const project = await Project.findById(projectId)

            await User.updateOne({ _id: id }, { $push: { savedProjects: project._id } })

        })()
    },

    /**
     * 
     * @param {string} id 
     * @returns {Promise <Array>}
     */
    listSavedProjects(id) {

        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim()) throw new ValueError('id is empty or blank')

        return (async () => {

            const user = await User.findById(id).populate('savedProjects').lean().exec()

            const savedProjects = user.savedProjects

            savedProjects.forEach(project => {

                project.id = project._id.toString()

                delete project._id

                delete project.__v

                project.owner = project.owner.toString()

                return project
            })

            return savedProjects


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

            const project = await Project.findById(projectId).populate('owner')
                .populate('collaborators')
                .populate('pendingCollaborators')
                .lean()
                .exec()

            project.id = project._id.toString()

            delete project._id

            delete project.__v

            project.owner.id = project.owner._id.toString()

            delete project.owner._id

            delete project.owner.__v

            project.collaborators.forEach(collaborator => {

                collaborator.id = collaborator._id.toString()

                delete collaborator._id

                delete collaborator.__v

                return collaborator
            })

            project.pendingCollaborators.forEach(collaborator => {

                collaborator.id = collaborator._id.toString()

                delete collaborator._id

                delete collaborator.__v

                return collaborator
            })

            if (!project) throw new NotFoundError(`project with id ${projectId} not found`)

            return project

        })()
    },

    /**
     * Allow user to request to be a collaborator in a project
     * @param {string} id 
     * @param {string} projectId 
     */
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

    /**
     * 
     * @param {string} id 
     * @param {string} collabId 
     * @param {string} projectId 
     * @param {string} decision 
     */
    handleCollaboration(id, collabId, projectId, decision) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)

        if (!id.trim()) throw new ValueError('id is empty or blank')
        if (!projectId.trim()) throw new ValueError('projectId is empty or blank')

        return (async () => {

            const project = await Project.findById(projectId)

            const collab = await User.findById(collabId)

            if (id !== project.owner.toString()) throw Error('not the owner of the project')

            if (decision === 'accept') {
                await Project.updateOne(
                    { _id: projectId },
                    {
                        $pull: { pendingCollaborators: collab.id },
                        $push: { collaborators: collab.id }
                    }
                )
            } else {

                await Project.updateOne(
                    { _id: projectId },
                    {
                        $pull: { pendingCollaborators: collab.id },
                    }
                )
            }


        })()
    },

    leaveProject(id, projectId) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)

        if (!id.trim()) throw new ValueError('id is empty or blank')
        if (!projectId.trim()) throw new ValueError('projectId is empty or blank')

        return (async () => {

            const user = await User.findById(id)

            if (!user) throw Error('user does not exist')

            await Project.updateOne(
                { _id: projectId },
                {
                    $pull: { collaborators: user.id },
                }
            )



        })()
    },


    /**
     * 
     * @param {string} id 
     * @param {string} projectId 
     * @param {string} date 
     * @param {string} location 
     */
    addMeeting(id, projectId, date, location) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)

        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)

        return (async () => {
            const user = await User.findById(id)

            const project = await Project.findById(projectId)

            if (!project) throw new NotFoundError(`project with id ${projectId} not found`)

            const meeting = new Meeting({ project: project.id, date, location, attending: [user._id] })

            await meeting.save()

        })()
    },
    /**
     * 
     * @param {string} meetingId 
     */
    deleteMeeting(meetingId) {
        // if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof meetingId !== 'string') throw TypeError(`${meetingId} is not a string`)

        // if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof meetingId !== 'string') throw TypeError(`${meetingId} is not a string`)

        return (async () => {

            const meeting = await Meeting.findById(meetingId)

            if (!meeting) throw new NotFoundError(`meeting with id ${id} not found`)

            await meeting.remove()

        })()
    },

    /**
     * 
     * @param {string} projectId 
     * @returns {Promise <Object>}
     */
    listProjectMeetings(projectId) {
        // if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)

        // if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)

        return (async () => {

            const meetings = await Meeting.find({ project: projectId }).lean().exec()

            meetings.forEach(meeting => {
                if (meeting._id) {
                    meeting.id = meeting._id.toString()

                    delete meeting._id

                    delete meeting.__v
                }

                meeting.attending.forEach(id => {
                    return id.toString()

                })

                return meeting
            })

            return meetings

        })()
    },

    retrieveMeetingInfo(meetingId) {
        if (typeof meetingId !== 'string') throw TypeError(`${meetingId} is not a string`)

        return (async () => {
            const meeting = await Meeting.findById(meetingId).populate('attending').lean().exec()

            meeting.attending.forEach(attendee => {

                attendee.id = attendee._id.toString()

                delete attendee._id

                delete attendee.__v

                return attendee

            })

            return meeting
        })()
    },

    /**
     * 
     * @param {string} id 
     * @param {string} meetingId 
     */
    attendMeeting(id, meetingId) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof meetingId !== 'string') throw TypeError(`${meetingId} is not a string`)

        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof meetingId !== 'string') throw TypeError(`${meetingId} is not a string`)

        return (async () => {

            const user = await User.findById(id)

            await Meeting.updateOne({ _id: meetingId }, { $push: { attending: user.id } })


        })()
    },

    unAttendMeeting(id, meetingId) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof meetingId !== 'string') throw TypeError(`${meetingId} is not a string`)

        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof meetingId !== 'string') throw TypeError(`${meetingId} is not a string`)

        return (async () => {

            const user = await User.findById(id)

            await Meeting.updateOne({ _id: meetingId }, { $pull: { attending: user.id } })


        })()
    },

    userUpcomingMeetings(id) {

        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        return (async () => {

            const user = await User.findById(id)

            const meetings = await Meeting.find({ attending: { $in: [user.id] } })

            meetings.forEach(meeting => {
                meeting.id = meeting._id.toString()

                delete meeting._id

                return meeting
            })

            return meetings


        })()
    },

    /**
     * 
     * @param {string} query 
     * @returns {Promise <Object>}
     */
    searchProjects(query) {

        validate([{ key: 'query', value: query, type: String, optional: true }])

        return (async () => {
            if (query) {
                let newQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "")

                const projects = await Project.find({ name: { $regex: newQuery } })

                projects.forEach(project => {
                    project.id = project._id.toString()

                    delete project._id

                    project.owner = project.owner.toString()

                    return project
                })

                return projects

            }
        })()
    },

    /**
     * 
     * @param {array} array 
     * @returns {Promise <Object>}
     */
    filterProjects(query) {

        const array = query.split('+')

        if (!(array instanceof Array)) throw TypeError(`${id} is not a string`)

        return (async () => {
            if (array) {
                const projects = await Project.find({ skills: { $all: array } })

                projects.forEach(project => {
                    project.id = project._id.toString()

                    delete project._id
                    //DELETE _V
                    project.owner = project.owner.toString()

                    return project
                })

                return projects
            } else {

                const projects = await Project.find()

                projects.forEach(project => {

                    project.id = project._id.toString()

                    delete project._id

                    project.owner = project.owner.toString()

                    return project
                })

                return projects

            }


        })()

    },



    insertProfileImage(userId, file) {
        validate([
            { key: 'userId', value: userId, type: String },

        ])

        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((result, error) => {
                    if (error) return reject(error)

                    resolve(result)
                })

                file.pipe(stream)
            })

            await User.updateOne({ _id: userId }, { profileImage: result.url })

        })()
    },

    insertProjectImage(projectId, file) {
        validate([
            { key: 'projectId', value: projectId, type: String },

        ])

        return (async () => {
            let project = await Project.findById(projectId)

            if (!project) throw new NotFoundError(`project does not exist`)

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((result, error) => {
                    if (error) return reject(error)

                    resolve(result)
                })

                file.pipe(stream)
            })

            await Project.updateOne({ _id: projectId }, { projectImage: result.url })
            const projects = await Project.find()

        })()
    },


}

module.exports = logic 