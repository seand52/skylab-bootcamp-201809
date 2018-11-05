require('dotenv').config()
const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser')
const logic = require('./logic')
const package = require('./package.json')

const {
    argv: [, , port = process.env.PORT || 8080]
} = process

const app = express()

app.use(express.static('./public'))
app.set('view engine', 'pug')


const formBodyParser = bodyParser.urlencoded({
    extended: false
})

const mySession = session({
    secret: 'my super secret',
    cookie: {
        maxAge: 60 * 60 * 24 * 1000
    },
    resave: true,
    saveUninitialized: true,
    store: new FileStore({
        path: './.sessions'
    })
})

app.use(mySession)


app.get('/', (req, res) => {
    req.session.error = null

    res.render('landing')
})

app.get('/register', (req, res) => {

    res.render('register', {
        error: req.session.error
    })
})

app.post('/register', formBodyParser, (req, res) => {

    const {
        name,
        surname,
        username,
        password
    } = req.body

    try {
        logic.registerUser(name, surname, username, password)
            .then(() => {
                req.session.error = null

                res.render('register-confirm', {
                    name
                })
            })
            .catch(({
                message
            }) => {
                req.session.error = message
                res.redirect('/register')
            })

    } catch ({
        message
    }) {
        req.session.error = message

        res.redirect('/register')
    }
})

app.get('/login', (req, res) => {

    res.render('login', {
        error: req.session.error
    })
})

app.post('/login', [formBodyParser, mySession], (req, res) => {
    const {
        username,
        password
    } = req.body

    try {

        logic.authenticateUser(username, password)
            .then(id => {

                req.session.userId = id
                delete req.session.error

                delete req.session.postitId

                res.redirect('/home')
            })
            .catch(({ message }) => {
                req.session.error = message

                res.redirect('/login')
            })
    } catch ({
        message
    }) {
        req.session.error = message

        res.redirect('/login')
    }
})

app.get('/home', mySession, (req, res) => {

    const id = req.session.userId

    if (id) {
        try {
            logic.retrieveUser(id)
                .then(({ name }) => {
                    
                    res.render('home', { name })

                })
                .catch(({
                    message
                }) => {
                    req.session.error = message
                    res.redirect('/')
                })
        } catch ({
            message
        }) {
            req.session.error = message
            res.redirect('/')
        }
    } else res.redirect('/')
})

app.get('/logout', mySession, (req, res) => {
    req.session.userId = null

    res.redirect('/')
})


app.get('/postits', mySession, (req, res) => {
    const id = req.session.userId

    if (id) {

        logic.retrieveUser(id)
            .then(user => {
                res.render('postits', {
                    user: user
                })
            })
            .catch(({
                message
            }) => {
                error = message
                res.redirect('/')
            })


    } else res.redirect('/')
})

app.post('/postits/:id', [mySession, formBodyParser], (req, res) => {

    const {
        operation,
        text,
        postitId
    } = req.body

    const id = req.session.userId

    try {
        switch (operation) {
            case 'remove':
                logic.deletePostit(id, req.params.id)
                    .then(() => {
                        res.redirect('/postits')
                    })
                    .catch(({
                        message
                    }) => {
                        req.session.error = message
                    })
                break
            case 'edit':

                logic.editPostit(id, postitId, text)
                    .then(() => res.redirect('/postits'))

                break

            default:
                res.redirect('/home')
        }
    } catch ({
        message
    }) {
        req.session.error = message
        res.redirect('/home')
    }
})


app.post('/postits', [formBodyParser, mySession], (req, res) => {

    const id = req.session.userId

    const {
        postit
    } = req.body

    logic.createPostit(id, postit)
        .then(() => {
            res.redirect('/postits')
        })
        .catch(({
            message
        }) => {
            req.session.error = message
        })



})

app.listen(port, () => console.log(`Server ${package.version} up and running on port ${port}`))