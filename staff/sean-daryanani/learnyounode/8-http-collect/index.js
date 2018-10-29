// const [,,url] = process.argv

// const http = require('http')



// let res = http.get(url, function(response) {

//     let str = ""

//     response.setEncoding('utf8')

//     response.on('data', data => {

//         str += data
//     })
    
//     response.on('end', end => {

//         console.log(str.length)

//         console.log(str)
//     })

    
// })

const [,,url] = process.argv


const http = require('http')

var bl = require('bl')

http.get(url, function(response) {
    // response.setEncoding('utf8')
    response.pipe(bl((err, data) => {
        console.log(data.length)
        console.log(data.toString())
    }))
})