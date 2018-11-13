// import data from './data'
const data = require('./data')


const logic = {

    _postits : [],
    _token: sessionStorage.getItem('token') || null,
    _id: sessionStorage.getItem('userId') || null,

    registerUser(name, surname, username, password) {

        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw Error('name is empty or blank')
        if (!surname.trim()) throw Error('surname is empty or blank')
        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
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


        return fetch('http://localhost:5000/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(res => {
                const { id, token } = res.data

                this._userId = id
                this._token = token

                sessionStorage.setItem('userId', id)
                sessionStorage.setItem('token', token)
                return res

            })
    },

    sendUpdatedInfo(id, name, surname, username, newPassword, password) {



        return fetch(`http://localhost:5000/api/users/${id}`, {
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
                console.log(res)

            })


    },

    createPostit(text, userID, token) {
        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

        if (!text.trim()) throw Error('text is empty or blank')

        if (typeof userID !== 'string') throw new TypeError(`${userID} is not a string`)

        if (!userID.trim()) throw Error('userId is empty or blank')

        if (typeof token !== 'string') throw TypeError(`${token} is not a string`)

        if (!token.trim()) throw Error('token is empty or blank')

        // this._postits.push(new Postit(text))

        return fetch(`http://localhost:5000/api/users/${userID}/postits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text })
        })
            .then(res => res.json())
            .then(res => {

                if (res.error) throw Error(res.error)

            })
    },

    listPostits(userID, token) {
        if (typeof userID !== 'string') throw new TypeError(`${userID} is not a string`)

        if (!userID.trim()) throw Error('userID is empty or blank')

        if (typeof token !== 'string') throw TypeError(`${token} is not a string`)

        if (!token.trim()) throw Error('token is empty or blank')
        
        return fetch(`http://localhost:5000/api/users/${userID}/postits`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                
                if (res.error) throw Error(res.error)

                return res.data
            })
        },


    deletePostit(id, userID, token) {
        if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)

        if (typeof userID !== 'string') throw new TypeError(`${userID} is not a string`)

        if (!userID.trim()) throw Error('userID is empty or blank')

        if (typeof token !== 'string') throw TypeError(`${token} is not a string`)

        if (!token.trim()) throw Error('token is empty or blank')

        this._postits = this._postits.filter(postit => postit.id !==id)

        return fetch(`http://localhost:5000/api/users/${userID}/postits/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },

        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
      
    },

    updatePost(id, text, userID, token) {
        if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)

        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

        // if (!text.trim()) throw Error('text is empty or blank')

        if (typeof userID !== 'string') throw new TypeError(`${userID} is not a string`)

        if (!userID.trim()) throw Error('userID is empty or blank')

        if (typeof token !== 'string') throw TypeError(`${token} is not a string`)

        if (!token.trim()) throw Error('token is empty or blank')

        const postit = this._postits.filter(postit => postit.id === id)

        postit.text = text

        return fetch(`http://localhost:5000/api/users/${userID}/postits/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
        
    },

    retrieveUserInfo(userID, token) {

        return fetch(`http://localhost:5000/api/users/${userID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                
                if (res.error) throw Error(res.error)

                const {data} = res

                return data
            })
    }

}

// export default logic
module.exports = logic