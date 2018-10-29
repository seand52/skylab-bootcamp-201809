var http = require('http')

var fs = require('fs')

var server = http.createServer(function(req, res) {
    let readStream = fs.createReadStream(process.argv[3])

    readStream.on('open', function() {
        readStream.pipe(res)
    })
})

server.listen(process.argv[2])


