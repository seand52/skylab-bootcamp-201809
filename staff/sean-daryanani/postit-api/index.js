require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const logic = require('./logic')
const package = require('./package.json')
const jwt = require('jsonwebtoken')

const { env: { PORT, JWT_SECRET } } = process

const { argv: [, , port = PORT || 8080] } = process

const app = express()

const jsonBodyParser = bodyParser.json()

app.post('/api/users', jsonBodyParser, (req, res) => {
    const { name, surname, username, password } = req.body

    try {
        logic.registerUser(name, surname, username, password)
            .then(() =>
                res.json({
                    status: 'OK',
                    message: `${username} successfully registered`
                })
            )
            .catch(({ message }) =>
                res.json({
                    status: 'KO',
                    message
                })
            )
    } catch ({ message }) {
        res.json({
            status: 'KO',
            message
        })
    }
})

app.post('/api/auth', jsonBodyParser, (req, res) => {
    const { username, password } = req.body

    try {
        logic.authenticateUser(username, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, JWT_SECRET)

                res.json({
                    status: 'OK',
                    data: {
                        id,
                        token
                    }
                })
            })
            .catch(({ message }) =>
                res.json({
                    status: 'KO',
                    message
                })
            )
    } catch ({ message }) {
        res.json({
            status: 'KO',
            message
        })
    }
})

app.get('/api/users/:id', (req, res) => {
    const { params: { id }, headers: { authorization } } = req

    
    try {
        const token = authorization.split(' ')[1]
        const { sub } = jwt.verify(token, JWT_SECRET)

        if (id !== sub) throw Error('token sub does not match user id')

        logic.retrieveUser(id)
            .then(user =>
                res.json({
                    status: 'OK',
                    data: user
                })
            )
            .catch(({ message }) =>
                res.json({
                    status: 'KO',
                    message
                })
            )
    } catch ({ message }) {
        res.json({
            status: 'KO',
            message
        })
    }
})



app.post('/api/users/:id/postits', jsonBodyParser, (req, res) => {

    const { headers: { authorization }, params: {id}, body: {text} } = req
    
    try {
        const token = authorization.split(' ')[1]

        const { sub } = jwt.verify(token, JWT_SECRET)
        
        if (id!== sub) throw Error('token sub does not match user id')


            logic.addPostit(id, text)
                .then(() => {

                    res.json({
                        status: 'OK',
                        message: 'postit added'
                    })

                })
                .catch(() => {
                    res.json({
                        status: 'KO',
                        message: 'failed to add postit'
                    })
                })

    } catch ({ message }) {
        res.json({
            status: 'KO',
            message: 'token not valid'
        })
    }
})

app.get('/api/users/:id/postits', jsonBodyParser, (req, res) => {
    const { headers: { authorization }, params: { id } } = req

    try {
        const token = authorization.split(' ')[1]

        const { sub } = jwt.verify(token, JWT_SECRET)

        if (id !== sub) throw Error('token sub does not match user id')

        logic.listPostits(id)
            .then(postits => res.json({
                status: 'OK',
                data: postits
            }))
            .catch(({ message }) =>
                res.json({
                    status: 'KO',
                    message
                })
            )
    } catch ({ message }) {
        res.json({
            status: 'KO',
            message
        })
    }
})

//delete postit
app.delete('/api/users/:id/postits/:postit_id', jsonBodyParser, (req, res) => {

    const { params: { id, postit_id }, headers: { authorization } } = req

    
    try {
        const token = authorization.split(' ')[1]

        const { sub } = jwt.verify(token, JWT_SECRET)

        if(id!==sub) throw Error('token sub does not match user id')

        logic.removePostit(id, postit_id)
            .then(() => {

                res.json({
                    status: 'OK',
                    text: 'postit deleted'
                })

            })
            .catch(() => {
                res.json({
                    status: 'KO',
                    message: 'failed to delete postit'
                })
            })

    } catch ({ message }) {
        res.json({
            status: 'KO',
            message: 'token not valid'
        })
    }
})

//modify postit:
app.put('/api/users/:id/postits/:postit_id', jsonBodyParser, (req, res) => {

    const { params: { id, postit_id }, headers: { authorization }, body: {text} } = req

    
    try {
        const token = authorization.split(' ')[1]
        
        const { sub } = jwt.verify(token, JWT_SECRET)

        if (id !== sub) throw Error('token sub does does not match user id')

        logic.modifyPostit(id, postit_id, text)
            .then(() => {

                res.json({
                    status: 'OK',
                    text: 'postit modified'
                })

            })
            .catch(() => {
                res.json({
                    status: 'KO',
                    message: 'failed to modify postit'
                })
            })

    } catch ({ message }) {

        res.json({
            status: 'KO',
            message: 'token not valid'
        })

    }
})


app.listen(port, () => console.log(`${package.name} ${package.version} up and running on port ${port}`))