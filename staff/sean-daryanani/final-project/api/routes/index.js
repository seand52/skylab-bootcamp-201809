const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
const bearerTokenParser = require('../utils/bearer-token-parser')
const jwtVerifier = require('./jwt-verifier')
const routeHandler = require('./route-handler')

const jsonBodyParser = bodyParser.json()

const router = express.Router()

const { env: { JWT_SECRET } } = process

router.post('/users', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { name, email, username, password } = req.body

        return logic.registerUser(name, email, username, password)
            .then(() => {
                res.status(201)

                res.json({
                    message: `${username} successfully registered`
                })
            })
    }, res)
})

router.post('/auth', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { username, password } = req.body

        return logic.authenticateUser(username, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, JWT_SECRET)

                res.json({
                    data: {
                        id,
                        token
                    }
                })
            })
    }, res)
})

router.get('/users/:id', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveUser(id)
            .then(user =>
                res.json({
                    data: user
                })
            )
    }, res)
})

router.get('/user-profile/:id', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveProfileInfo(id)
            .then(user =>
                res.json({
                    data: user
                })
            )
    }, res)
})

router.patch('/users/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub, body: { name, surname, username, newPassword, password } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.updateUser(id, name ? name : null, surname ? surname : null, username ? username : null, newPassword ? newPassword : null, password)
            .then(() =>
                res.json({
                    message: 'user updated'
                })
            )
    }, res)
})

router.patch('/user-profile/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub, body: { bio, githubProfile, city, skills } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.updateProfile(id, bio ? bio : null, githubProfile ? githubProfile : null, city ? city : null, skills ? skills : null)
            .then(() =>
                res.json({
                    message: 'user profile updated'
                })
            )
    }, res)
})

router.post('/users/:id/projects', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {

        const { sub, params: { id }, body: { name, description, skills, beginnerFriendly, maxMembers } } = req


        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addNewProject(id, name, description, skills, beginnerFriendly, maxMembers)
            .then(() => res.json({
                message: 'project added'
            }))

    }, res)
})

//List own projects
router.get('/users/projects/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listOwnProjects(id)
            .then(projects => res.json({
                data: projects
            })
            )
    }, res)

})

//List collaborating projects
router.get('/users/:id/collaborating', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listCollaboratingProjects(id)
            .then(projects => res.json({
                data: projects
            })
            )
    }, res)

})

//Save project
router.post('/users/:id/projects/:projectid/save', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {

        const { sub, params: { id, projectid } } = req


        if (id !== sub) throw Error('token sub does not match user id')

        return logic.saveProject(id, projectid)
            .then(() => res.json({
                message: 'project saved'
            }))

    }, res)
})

//List saved projects
router.get('/users/:id/projects/save', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {

        const { sub, params: { id } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listSavedProjects(id)
            .then(projects => res.json({
                data: projects
            })
            )

    }, res)
})

//List info of a specific project
router.get('/users/:id/project/:projectid', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, projectid }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveProjectInfo(projectid)
            .then(project => res.json({
                data: project
            })
            )
    }, res)

})

router.post('/users/:id/projects/:projectid/collaborator', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {

        const { sub, params: { id, projectid }, body: { collaboratorId } } = req


        if (id !== sub) throw Error('token sub does not match user id')

        return logic.requestCollaboration(collaboratorId, projectid)
            .then(() => res.json({
                message: 'collaborator added to pending list'
            }))

    }, res)
})

router.patch('/users/:id/projects/:projectid/collaborator', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {

        const { sub, params: { id, projectid }, body: { decision, collaboratorId } } = req


        if (id !== sub) throw Error('token sub does not match user id')

        return logic.handleCollaboration(id, collaboratorId, projectid, decision)
            .then(() => res.json({
                message: 'collaborator handled'
            }))

    }, res)
})

router.post('/users/:id/projects/:projectid/meetings', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {

        const { sub, params: { id, projectid }, body: { date, location } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addMeeting(id, projectid, date, location)
            .then(() => res.json({
                message: 'meeting has been added'
            }))

    }, res)
})

router.delete('/users/:id/projects/meetings/:meetingid', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {

        const { sub, params: { id, meetingid } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.deleteMeeting(meetingid)
            .then(() => res.json({
                message: 'meeting has been deleted'
            }))

    }, res)
})

router.get('/users/:id/projects/:projectid/meetings', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, projectid }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listProjectMeetings(projectid)
            .then(projects => res.json({
                data: projects
            })
            )
    }, res)

})


router.put('/users/:id/projects/:meetingid/meetings', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, meetingid }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.attendMeeting(id, meetingid)
            .then(() => res.json({
                message: 'added to meeting'
            }))
    }, res)

})

router.get('/users/:id/meetings', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.userUpcomingMeetings(id)
            .then(meetings => res.json({
                data: meetings
            })
            )
    }, res)

})

router.get('/users/:id/projects/query', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub} = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.filterProjects(req.body.array)
            .then(projects => res.json({
                data: projects
            })
            )
    }, res)

})

// router.post('/users/:id/photo', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
//     routeHandler(() => {

//         const { sub, params: { id, projectid }, body: { file } } = req

//         if (id !== sub) throw Error('token sub does not match user id')

//         return logic.addMeeting(id, projectid, date, location)
//             .then(() => res.json({
//                 message: 'meeting has been added'
//             }))

//     }, res)
// })

module.exports = router