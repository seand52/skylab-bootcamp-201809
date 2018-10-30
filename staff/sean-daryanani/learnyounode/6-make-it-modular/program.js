const myModule = require('./index.js')

const dir = process.argv[2]

const ext = process.argv[3]

myModule(dir, ext, function(err, list) {
    
    if (err) console.log('Error detected', err)

    else {
        list.forEach(el => console.log(el))
    }
})