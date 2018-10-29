const urls = process.argv.slice(2)

var bl = require('bl')

const http = require('http')

let num = 0

let res= []


urls.forEach((url, index) => {

    http.get(url, function(response) {

        response.pipe(bl((err, data) => {

            res[index] = data.toString()

            // console.log(index)

            num++

            if(num===3) {

                res.forEach(item => console.log(item))
            }

        }))

    })

})


