const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
const bearerTokenParser = require('../utils/bearer-token-parser')
const jwtVerifier = require('./jwt-verifier')
const routeHandler = require('./route-handler')
const multer = require('multer')
const jsonBodyParser = bodyParser.json()
const fs = require('file-system')

const router = express.Router()

const { env: { JWT_SECRET } } = process


let storage = multer.diskStorage({
    destination: (req, file, cb) => {

        const path = __dirname + `/../data/users/${req.params.id}`

        if (!(fs.existsSync(path))) {

            fs.mkdirSync(path)
        }

        cb(null, path)
    },

    filename: (req, file, cb) => {
        cb(null, 'profile-image')
    }

});
var upload = multer({ storage: storage });

// const upload = multer({
//     dest: 'data/users', // this saves your file into a directory called "uploads"
//     filename: Date.now()
//   }); 

//   const storage = multer.diskStorage({
//     destination: 'data/users',
//     filename: Date.now()
//   });

router.post('/users', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { name, surname, username, password } = req.body

        return logic.registerUser(name, surname, username, password)
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

router.get('/users/:id/buddies', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveFriends(id)
            .then(buddies => res.json({

                data: buddies
            }))
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


router.post('/users/:id/postits', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {

        const { sub, params: { id }, body: { text, status } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addPostit(id, text, status)
            .then(() => res.json({
                message: 'postit added'
            }))

    }, res)
})

router.post('/users/:id/friends/:username', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {

        const { sub, params: { id, username } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addFriend(id, username)
            .then(() => res.json({
                message: 'friend added'
            }))

    }, res)
})

router.get('/users/:id/postits', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listPostits(id)
            .then(postits => res.json({
                data: postits
            }))
    }, res)
})

router.put('/users/:id/postits/:postitId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, postitId }, body: { text, status } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.modifyPostit(id, postitId, text, status)
            .then(() => res.json({
                message: 'postit modified'
            }))
    }, res)
})

router.delete('/users/:id/postits/:postitId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, postitId } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.removePostit(id, postitId)
            .then(() => res.json({
                message: 'postit removed'
            }))
    }, res)

})

router.post('/users/:id/postits/:postitId/friends/:username', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, postitId, username } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.assignPostit(id, postitId, username)
            .then(() => res.json({
                message: 'postit assigned'
            }))
    }, res)

})



// router.post('/users/fileUpload/:id', [bearerTokenParser, jwtVerifier, upload.single('image')], (req, res, next) => {
//     routeHandler(async () => {
//         const { sub, params: { id, postitId, username } } = req
//         console.log(req)
//         if (id !== sub) throw Error('token sub does not match user id')

//         // const ext = req.file.originalname.split('.')[1]

//         // if (ext !== 'png') throw Error('this file type is not supported')
//         res.json({
//             message: 'ok'
//         })
//     }, res)

// });


router.post('/users/fileUpload/:id', [bearerTokenParser, jwtVerifier, upload.single('image')], (req, res, next) => {

    const { sub, params: { id }, file: { mimetype, path } } = req

    if (id !== sub) throw Error('token sub does not match user id')    

    const bitmap = fs.readFileSync(path)

    const buffer = new Buffer(bitmap).toString('base64')

    const image = `data:${mimetype};base64,${buffer}`

    res.json({
        data: image
    })

});

router.get('/users/fileUpload/:id', [bearerTokenParser, jwtVerifier], (req, res) => {

    routeHandler(async () => {

        const { sub, params: { id, postitId, username } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        const path = __dirname + `/../data/users/${req.params.id}/profile-image`

        let bitmap = fs.readFileSync(path);

        let data = new Buffer(bitmap).toString('base64')

        data = `data:image/png;base64,${data}`

        res.json({
            data: data,
            message: 'ok'
        })

    }, res)
})




module.exports = router