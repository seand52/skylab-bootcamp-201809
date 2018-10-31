const fs = require('fs')

const [, , orig, dest] = process.argv


fs.lstat(orig,(err,stats) => {

    if (stats.isDirectory()) {

        fs.readdir(orig, (err, files) => {

            files.forEach(file => {
                
                if (file!=='.DS_Store') {

                    console.log(`${dest}/${file}`)

                    const rs = fs.createReadStream(file)

                    const ws = fs.createWriteStream(`${dest}/${file}`)

                    rs.pipe(ws)
                }

            })
        })
    }

    else if (stats.isFile()){

            const paths = dest.split('/')

            let currentpath = ''

            paths.forEach(path => {

                currentpath = currentpath + path + '/' 

                if (!fs.existsSync(currentpath)) {
                    fs.mkdirSync(currentpath, {recursive : true})
                }
            })

            const rs = fs.createReadStream(orig)

            const ws = fs.createWriteStream(`${dest}/${orig}`)
    
            rs.pipe(ws)      


    }
})

var path = require('path')
var fs = require('fs')

const {argv: [,,recu, src, dest]} = process

if (recu === '-R') {
    var recursive = function(src, dest) {
        
        if(fs.lstatSync(src).isDirectory()){

            fs.mkdirSync(dest)

            fs.readdirSync(src).forEach((item) => {
            recursive(path.join(src, item),
                                path.join(dest, item))
            })
        } else fs.createReadStream(src).pipe(fs.createWriteStream(dest))
    }

    recursive(src, dest)

}else fs.createReadStream(recu).pipe(fs.createWriteStream(src))
