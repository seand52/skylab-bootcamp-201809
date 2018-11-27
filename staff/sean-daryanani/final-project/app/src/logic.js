
global.sessionStorage = require('sessionstorage')

const logic = {
    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,

    url: 'NO-URL',

    _changeDate(isoDate, type) {

        let cleanDate = new Date(isoDate)
        if (type === 'meeting') {

            return `${cleanDate.getDate()}-${cleanDate.getMonth()}-${cleanDate.getFullYear()} at ${cleanDate.getHours()}:${cleanDate.getMinutes()}:${cleanDate.getSeconds()}`

        } else {

            return `${cleanDate.getDate()}-${cleanDate.getMonth()}-${cleanDate.getFullYear()}`
        }

    },

    registerUser(name, email, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof email !== 'string') throw TypeError(`${email} is not a string`)
        if (email.match(/^(([^<>()\[\]\\.,;:\s@“]+(\.[^<>()\[\]\\.,;:\s@“]+)*)|(“.+“))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) === null) throw Error(`${email} is an invalid email`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw Error('name is empty or blank')
        if (!email.trim()) throw Error('email is empty or blank')
        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return fetch(`${this.url}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name, email, username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    authenticate(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return fetch(`${this.url}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                const { id, token } = res.data

                this._userId = id
                this._token = token

                sessionStorage.setItem('userId', id)
                sessionStorage.setItem('token', token)

                return res
            })
    },

    get loggedIn() {
        return !!this._userId
    },

    get userId() {
        return this._userId
    },

    logout() {
        this._postits = []
        this._userId = null
        this._token = null

        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
    },

    retrieveUserProfile(id) {

        return fetch(`${this.url}/user-profile/${id || this._userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                res.data.joinDate = logic._changeDate(res.data.joinDate, 'profile')

                return res.data
            })
    },


    updateProfile(id, city, githubProfile, bio, skills) {
        if (typeof city !== 'string') throw TypeError(`${city} is not a string`)
        if (typeof githubProfile !== 'string') throw TypeError(`${githubProfile} is not a string`)
        if (typeof bio !== 'string') throw TypeError(`${bio} is not a string`)
        if (!(skills instanceof Array)) throw TypeError(`${skills} is not a string`)

        if (!city.trim()) throw Error('city is empty or blank')
        if (!githubProfile.trim()) throw Error('githubProfile is empty or blank')
        if (!bio.trim()) throw Error('bio is empty or blank')


        return fetch(`${this.url}/user-profile/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
            body: JSON.stringify({ city, githubProfile, bio, skills })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },


    listOwnProjects(id) {

        return fetch(`${this.url}/users/projects/${id || this._userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    },

    listCollaboratingProjects(id) {

        return fetch(`${this.url}/users/${id || this._userId}/collaborating`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    },

    saveProject(projectId) {

        return fetch(`${this.url}/users/${this._userId}/projects/${projectId}/save`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

            })
    },

    removeSavedProject(projectId) {
        return fetch(`${this.url}/users/${this._userId}/projects/${projectId}/save`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

            })
    },


    listSavedProjects() {
        return fetch(`${this.url}/users/${this._userId}/projects/save`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    },

    addNewProject(name, description, skills, beginnerFriendly, maxMembers, location) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof description !== 'string') throw TypeError(`${description} is not a string`)
        if (typeof beginnerFriendly !== 'string') throw TypeError(`${beginnerFriendly} is not a string`)
        if (typeof maxMembers !== 'string') throw TypeError(`${maxMembers} is not a string`)

        if (!name.trim()) throw Error('name is empty or blank')
        if (!description.trim()) throw Error('description is empty or blank')
        if (!beginnerFriendly.trim()) throw Error('beginnerFriendly is empty or blank')
        if (!maxMembers.trim()) throw Error('maxMembers is empty or blank')


        return fetch(`${this.url}/users/${this._userId}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
            body: JSON.stringify({ name, description, skills, beginnerFriendly, maxMembers, location })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    searchProjects(query) {
        if (typeof query !== 'string') throw TypeError(`${query} is not a string`)
        if (!query.trim()) throw Error('query is empty or blank')
        return fetch(`${this.url}/users/${this._userId}/projects/search/${query}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    },

    filterProjects(query) {

        if (typeof query !== 'string') throw TypeError(`${query} is not a string`)
        if (!query.trim()) throw Error('query is empty or blank')
        return fetch(`${this.url}/users/${this._userId}/projects/filter/${query}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })

    },

    retrieveProjectInfo(projectid) {

        if (typeof projectid !== 'string') throw TypeError(`${projectid} is not a string`)
        if (!projectid.trim()) throw Error('projectid is empty or blank')
        return fetch(`${this.url}/users/${this._userId}/project/${projectid}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    },

    listProjectMeetings(projectid) {
        if (typeof projectid !== 'string') throw TypeError(`${projectid} is not a string`)
        if (!projectid.trim()) throw Error('projectid is empty or blank')
        return fetch(`${this.url}/users/${this._userId}/projects/${projectid}/meetings`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                res.data.forEach(item => {
                    item.realDate = new Date(item.date)
                    item.listDate = logic._changeDate(item.date, 'meeting')
                })

                return res.data
            })
    },

    attendMeetings(meetingId) {
        if (typeof meetingId !== 'string') throw TypeError(`${meetingId} is not a string`)
        if (!meetingId.trim()) throw Error('meetingId is empty or blank')
        return fetch(`${this.url}/users/${this._userId}/projects/${meetingId}/meetings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    handleCollaboration(projectid, decision, collaboratorId) {
        if (typeof decision !== 'string') throw TypeError(`${decision} is not a string`)
        if (!decision.trim()) throw Error('decision is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/projects/${projectid}/collaborator`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
            body: JSON.stringify({ decision, collaboratorId })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    removeCollaborator(collaboratorId, projectId) {
        if (typeof collaboratorId !== 'string') throw TypeError(`${collaboratorId} is not a string`)
        if (!collaboratorId.trim()) throw Error('collaboratid is empty or blank')
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)
        if (!projectId.trim()) throw Error('projectId is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/projects/${projectId}/removecollaborator`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
            body: JSON.stringify({ collaboratorId })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    retrievePendingCollaboratorProjects(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim()) throw Error('id is empty or blank')

        return fetch(`${this.url}/users/${this._userId || id}/pendingcollaborators`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    },

    deleteMeeting(meetingId) {

        return fetch(`${this.url}/users/${this._userId}/projects/meetings/${meetingId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    attendMeeting(meetingId) {
        if (typeof meetingId !== 'string') throw TypeError(`${meetingId} is not a string`)
        if (!meetingId.trim()) throw Error('meetingId is empty or blank')
        return fetch(`${this.url}/users/${this._userId}/projects/meetings/${meetingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    retrieveMeetingInfo(meetingId) {
        if (typeof meetingId !== 'string') throw TypeError(`${meetingId} is not a string`)
        if (!meetingId.trim()) throw Error('meetingId is empty or blank')
        return fetch(`${this.url}/users/${this._userId}/meeting/${meetingId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })

    },

    unAttendMeeting(meetingId) {
        if (typeof meetingId !== 'string') throw TypeError(`${meetingId} is not a string`)
        if (!meetingId.trim()) throw Error('meetingId is empty or blank')
        return fetch(`${this.url}/users/${this._userId}/projects/meetings/${meetingId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    deleteProject(userId, projectId) {
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)

        if (!userId.trim()) throw Error('userId is empty or blank')
        if (!projectId.trim()) throw Error('projectId is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/deleteproject/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },
    leaveProject(projectId) {
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)

        if (!projectId.trim()) throw Error('projectId is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/projects/${projectId}/leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },


    requestCollaboration(projectId, collaboratorId) {
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)
        if (typeof collaboratorId !== 'string') throw TypeError(`${collaboratorId} is not a string`)

        if (!projectId.trim()) throw Error('projectId is empty or blank')
        if (!collaboratorId.trim()) throw Error('collaboratorId is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/projects/${projectId}/collaborator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
            body: JSON.stringify({ collaboratorId })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })


    },

    addMeeting(userId, projectId, startDate, location, description) {
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)
        if (typeof projectId !== 'string') throw TypeError(`${projectId} is not a string`)
        if (!(startDate instanceof Date)) throw TypeError(`${startDate} is not a date`)
        if (typeof location !== 'string') throw TypeError(`${location} is not a string`)
        if (typeof description !== 'string') throw TypeError(`${description} is not a string`)

        if (!userId.trim()) throw Error('userId is empty or blank')
        if (!projectId.trim()) throw Error('projectId is empty or blank')
        if (!location.trim()) throw Error('location is empty or blank')
        if (!description.trim()) throw Error('description is empty or blank')


        return fetch(`${this.url}/users/${this._userId}/projects/${projectId}/meetings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
            body: JSON.stringify({ startDate, location, description })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })


    },



    addProfileImage(file) {
        let avatar = new FormData()

        avatar.append('avatar', file)

        return fetch(`${this.url}/users/${this._userId}/photo`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this._token}`
            },
            body: avatar
        })
            .then(res => res.json())
            .then(res => res.data)
    },


}

// export default logic
module.exports = logic