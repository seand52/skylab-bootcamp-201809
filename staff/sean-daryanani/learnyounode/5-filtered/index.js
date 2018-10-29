var fs = require('fs')

var dirs = fs.readdir(process.argv[2], function(err, list) {

    var x = list.filter(el => el.split('.')[1]===process.argv[3])

    for (var i =0; i<x.length; i++) {
        console.log(x[i])
    }

})

