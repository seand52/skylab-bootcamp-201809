const urls = process.argv.slice(2)

var bl = require('bl')

const http = require('http')

let num = 0

let res= []


urls.forEach((url, index) => {

    http.get(url, function(response) {

        response.pipe(bl((err, data) => {

            res[index] = data.toString()

            num++

            if(num===3) {

                res.forEach(item => console.log(item))
            }

        }))

    })

})


//Vanilla node solution
// const http = require('http')

// const {argv: [,,...urls]} = process

// const contents = []

// let count = 0

// urls.forEach((url, index) => {
//     http.get(url, res => {
//         res.setEncoding('utf8')

//         let content =''

//         res.on('data', chunk => content += chunk)

//         res.on('end', () => {
            
//             contents[index] = content

//             count++

//             if (count===urls.length) 
//                 contents.forEach(content => console.log(content))
//             ))
//         }
//     })
// })

