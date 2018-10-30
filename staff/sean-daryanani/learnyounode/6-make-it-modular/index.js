const fs = require('fs')

const path = require('path')

module.exports = function (dir, extension, callback) {

    fs.readdir(dir, function (err, list) {

        if (err) return callback(err)

        else {

            let filtered = list.filter(el => el.split('.')[1] === extension)

            callback(null, filtered)
        }
    })
}
