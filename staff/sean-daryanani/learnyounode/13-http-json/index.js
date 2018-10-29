let http = require('http')
const url = require('url')



server = http.createServer((req, res) => {

    let request = url.parse(req.url, true)

    let result

    if (request.pathname === '/api/parsetime') {
        result = returnJSON(request.query.iso)

        res.writeHead(200, { 'Content-Type': 'application/json' })

        res.end(result)

    }
    else if (request.pathname === '/api/unixtime') {
        
        result = returnMilliSeconds(request.query.iso)

        res.writeHead(200, { 'Content-Type': 'application/json' })    
        
        res.end(result)
    }


})

server.listen(Number(process.argv[2]))

function returnJSON(d) {
    let newDate = new Date(d)

    let hour = newDate.getHours()
    let minute = newDate.getMinutes()
    let second = newDate.getSeconds()

    let obj = {
        'hour': hour < 10 ? '0' + hour : hour,
        'minute': minute < 10 ? '0' + minute : minute,
        'second': second < 10 ? '0' + second : second
    }
    return JSON.stringify(obj)
}

function returnMilliSeconds(d) {
    let date = new Date(d)
    let obj = {
        unixtime: date.getTime()
    }
    return JSON.stringify(obj)
}


