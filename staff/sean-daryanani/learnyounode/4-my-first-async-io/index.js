var fs = require('fs')

var text = fs.readFile(process.argv[2], function (err, buf) {

    var num = buf.toString().split('\n').length-1

    console.log(num)
})
