require('dotenv').config()
const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser')
const buildView = require('./helpers/build-view')
const logic = require('./logic')

const { argv: [, , port = process.env.PORT || 8080] } = process

const app = express()

app.use(express.static('./public'))

let error = null

const formBodyParser = bodyParser.urlencoded({ extended: false })

const mySession = session({ 
    secret: 'my super secret', 
    cookie: { maxAge: 60 * 60 * 24 },
    resave: true,
    saveUninitialized: true,
    store: new FileStore({
        path: './.sessions'
    })
})


app.get('/', (req, res) => {
    error = null

    res.send(buildView(`<a href="/login">Login</a> or <a href="/register">Register</a>`))
})

app.get('/register', (req, res) => {

    res.send(buildView(`<form action="/register" method="POST">
            <input type="text" name="name" placeholder="Name">
            <input type="text" name="surname" placeholder="Surname">
            <input type="text" name="username" placeholder="username">
            <input type="password" name="password" placeholder="password">
            <button type="submit">Register</button>
        </form>
        ${error ? `<p class="error">${error}</p>` : ''}
        <a href="/">go back</a>`))
})

app.post('/register', formBodyParser, (req, res) => {

    const { name, surname, username, password } = req.body

    try {
        logic.registerUser(name, surname, username, password)

        error = null

        res.send(buildView(`<p>Ok! user ${name} registered.</p>
                <a href="/">go back</a>`))

    } catch ({ message }) {
        error = message

        res.redirect('/register')
    }
})

app.get('/login', (req, res) => {

    res.send(buildView(`<form action="/login" method="POST">
            <input type="text" name="username" placeholder="username">
            <input type="password" name="password" placeholder="password">
            <button type="submit">Login</button>
        </form>

        ${error ? `<p class="error">${error}</p>` : ''}
        <a href="/">go back</a>`))
})

app.post('/login', [formBodyParser, mySession], (req, res) => {
    const { username, password } = req.body

    try {
        const id = logic.authenticateUser(username, password)

        req.session.userId = id

        res.redirect('/home')
    } catch ({ message }) {
        error = message

        res.redirect('/login')
    }
})

app.get('/home', mySession, (req, res) => {

    const id = req.session.userId

    if (id) {
        const user = logic.retrieveUser(id)

        res.send(buildView(`<p>Welcome ${user.name}!</p>
                        <a href="/logout">logout</a><br>
                        <a href="/postits">Make Postit</a>
                        `))
    } else res.redirect('/')
})

app.get('/logout', mySession, (req, res) => {
    req.session.userId = null

    res.redirect('/')
})

app.get('/users', (req, res) => {
    res.send(buildView(`<ul>
            ${logic._users.map(user => `<li>${user.id} ${user.name} ${user.surname}</li>`).join('')}
        </ul>
        <a href="/">go back</a>`))
})

app.get('/postits', mySession, (req, res) => {

    const id = req.session.userId

    if (id) {
        
        const user = logic.retrieveUser(id)

        const listPostits = user.postits.map((item, index) => {
            return `<li>
            <input type="text" value=${item.postit}>
           <form action="/postits/${item.id}" method="POST">
            <button type="submit">x</button>
            </form>
            </li>`
        }).join('')

        res.send(buildView(`
        <p>Welcome ${user.name}!</p>
        <form action="/postits" method="POST">
        <input type="text" name="postit"></input>
        <button type="submit">Create</button>
        <a href="/logout">logout</a>
        </form>
        <ul>
            ${listPostits}
        </ul>
        
        `))
    } else res.redirect('/')
})

app.post('/postits/:id', mySession, (req, res) => {
    
    const id = req.session.userId

    logic.deletePostit(id, req.params.id)

    res.redirect('/postits')
})

app.post('/postits', [formBodyParser, mySession], (req, res) => {

    const id = req.session.userId

    const { postit } = req.body

    logic.createPostit(id, postit)

    res.redirect('/postits')

})

app.listen(port, () => console.log(`Server up and running on port ${port}`))