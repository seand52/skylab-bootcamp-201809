const express = require('express')

const { argv: [, , port] } = process

const app = express()

const users = []

let nameUser = ''

let wrongCredentials = null

if (nameUser === '') {
    app.get('/', (req, res) => {
        res.send(`<!DOCTYPE html>
    <html>
        <head>
            <title>Hello World!</title>
        </head>
        <body>
            <h1>Hello World!</h1>
            <a href="/login">Login</a> or <a href="/register">Register</a>
        </body>
    </html>`)
    })
}

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <a href="/login">Login</a> or <a href="/register">Register</a>
    </body>
</html>`)
})

app.get('/login', (req, res) => {
    let wrongText = wrongCredentials=== true ? 'Wrong credentials' : ''
    resetWrongCredentials = () => {
        wrongCredentials = null
    }
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <form action="/login" method="POST">
            <input type="text" name="username" placeholder="username">
            <input type="password" name="password" placeholder="password">
            <button type="submit">Login</button>
        </form>
        <p>${wrongText}</p>
        <a onClick=${resetWrongCredentials()} href="/">go back</a>
    </body>
</html>`)
})

app.get('/register', (req, res) => {

    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <form action="/register" method="POST">
            <input type="text" name="name" placeholder="Name">
            <input type="text" name="surname" placeholder="Surname">
            <input type="text" name="username" placeholder="username">
            <input type="password" name="password" placeholder="password">
            <button type="submit">Register</button>
        </form>
        <a href="/">go back</a>
    </body>
</html>`)
})

app.post('/register', (req, res) => {


    let data = ''

    req.on('data', chunk => data += chunk)

    req.on('end', () => {
        const keyValues = data.split('&')

        const user = { id: Date.now() }

        keyValues.forEach(keyValue => {
            const [key, value] = keyValue.split('=')

            user[key] = value
        })

        users.push(user)

        res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <p>Ok! user ${user.name} registered.</p>
        <a href="/">go back</a>
    </body>
</html>`)
    })
})

app.post('/login', (req, res) => {
    let data = ''

    req.on('data', chunk => data += chunk)

    req.on('end', () => {

        let verify = {}

        const keyValues = data.split('&')

        keyValues.forEach(keyValue => {
            const [key, value] = keyValue.split('=')

            verify[key] = value
        })

        users.forEach(item => {
            console.log(item)
            if (item.username === verify.username && item.password === verify.password) {
                return verify = {
                    ...verify,
                    authenticate:true
                }
            }
        })

        console.log(verify)

        if (verify.authenticate===true) {
            nameUser = verify.username 
            res.redirect('/home')
            verify = {}
        }
        else {
            wrongCredentials = true
            res.redirect('/login')
            verify = {}
        }

    })
})


app.get('/users', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <ul>
            ${users.map(user => `<li>${user.id} ${user.name} ${user.surname}</li>`).join('')}
        </ul>
        <a href="/">go back</a>
    </body>
</html>`)
})


app.get('/home', (req, res) => {

    if (nameUser==='') {
        res.redirect('/')
    }
    else {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello ${nameUser}!</h1>
        <a href="/logoutHandle">Logout</a>
    </body>
</html>`)
    }
})



app.get('/logoutHandle', (req, res) => {

    nameUser=''

    res.redirect('/')
})

app.listen(port || 3000)


