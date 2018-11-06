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

app.post('/api/user', jsonBodyParser, (req, res) => {
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

app.get('/api/user/:id', (req, res) => {
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

app.get('/logout', (req, res) => {
    req.session.userId = null

    res.redirect('/')
})

app.post('/api/postit', jsonBodyParser, (req, res) => {

    const { headers: { authorization } } = req
    
    try {
        const token = authorization.split(' ')[1]

        const { sub } = jwt.verify(token, JWT_SECRET)
 
            const { text } = req.body

            logic.addPostit(sub, text)
                .then(() => {

                    res.json({
                        status: 'OK',
                        text
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

//delete postit
app.delete('/api/postit/:postit_id', jsonBodyParser, (req, res) => {

    const { params: { postit_id }, headers: { authorization } } = req

    
    try {
        const token = authorization.split(' ')[1]

        const { sub } = jwt.verify(token, JWT_SECRET)

        logic.removePostit(sub, postit_id)
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
app.put('/api/postit/:postit_id', jsonBodyParser, (req, res) => {

    const { params: { postit_id }, headers: { authorization } } = req

    
    try {
        const token = authorization.split(' ')[1]

        const { sub } = jwt.verify(token, JWT_SECRET)
        const { text } = req.body
        logic.modifyPostit(sub, postit_id, text)
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