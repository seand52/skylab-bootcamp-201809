const [,,url] = process.argv

const http = require('http')

let res = http.get(url, function(response) {

    response.setEncoding('utf8')

    response.on('data', (data) => console.log(data))

    response.on('error', (e) => console.log(e))
    
}).on('error', e => console.log(e))