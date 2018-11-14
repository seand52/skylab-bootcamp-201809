const logic = {
    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,

    url: 'NO-URL',

    registerUser(name, surname, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw Error('name is empty or blank')
        if (!surname.trim()) throw Error('surname is empty or blank')
        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return fetch(`${this.url}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name, surname, username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    login(username, password) {
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

    logout() {
        this._postits = []
        this._userId = null
        this._token = null

        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
    },

    addFriends(id, username) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim()) throw Error('id is empty or blank')

        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)

        if (!username.trim()) throw Error('username is empty or blank')

        return fetch(`${this.url}/users/${id}/friends/${username}`, {
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

    retrieveFriends(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim()) throw Error('id is empty or blank')

        return fetch(`${this.url}/users/${id}/buddies`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
        .then(res=>res.json())
        .then(res => {
            if (res.error) throw Error(res.error)
            return res.data
        })
    },

    addPostit(text, status) {

        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

        if (!text.trim()) throw Error('text is empty or blank')

        if (typeof status !== 'string') throw TypeError(`${status} is not a string`)

        if (!status.trim()) throw Error('status is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/postits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ text, status })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    retrieveUser(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim()) throw Error('id is empty or blank')
        debugger
        return fetch(`${this.url}/users/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {

                return res.username
            })

    },

    listPostits() {
        return fetch(`${this.url}/users/${this._userId}/postits`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                let y = res.data.map(item => {
                    if(item.user=== this._userId) {
                    return item.isAssigned=false
                }
                return item.isAssigned=true
                })

                return res.data
            })
    },

    removePostit(id) {
        if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)

        if (!id.trim().length) throw Error('id is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/postits/${id}`, {
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

    modifyPostit(id, text, status) {
        if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)

        if (!id.trim().length) throw Error('id is empty or blank')

        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

        if (!text.trim()) throw Error('text is empty or blank')

        if (typeof status !== 'string') throw TypeError(`${status} is not a string`)

        if (!status.trim()) throw Error('status is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/postits/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ text, status })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    sendUpdatedInfo(name, surname, username, newPassword, password) {

        return fetch(`http://localhost:5000/api/users/${this._userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
            body: JSON.stringify({ name, surname, username, newPassword, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

            })


    },

    assignPostit(userId, postitId, username) {
        if (typeof userId !== 'string') throw new TypeError(`${userId} is not a string`)

        if (!userId.trim().length) throw Error('userId is empty or blank')

        if (typeof postitId !== 'string') throw new TypeError(`${postitId} is not a string`)

        if (!postitId.trim().length) throw Error('postitId is empty or blank')

        if (typeof username !== 'string') throw new TypeError(`${username} is not a string`)

        if (!username.trim().length) throw Error('username is empty or blank')

        return fetch(`${this.url}/users/${userId}/postits/${postitId}/friends/${username}`, {
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

    }
}

// export default logic
module.exports = logic