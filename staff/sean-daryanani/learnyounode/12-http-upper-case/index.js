let http = require('http')

let fs = require('fs')

let map = require('through2-map')

var server = http.createServer((req, res) => {
    req.pipe(map(function(chunk) {
        return chunk.toString().toUpperCase()
    })).pipe(res)
})

server.listen(process.argv[2])