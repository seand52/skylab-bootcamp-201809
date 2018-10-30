let http = require('http')

let fs = require('fs')

let map = require('through2-map')

var server = http.createServer((req, res) => {

    if (req.method!== 'POST') return res.end('send me a POST\n')

    req.pipe(map(function(chunk) {

        return chunk.toString().toUpperCase()

    })).pipe(res)
})

server.listen(process.argv[2])