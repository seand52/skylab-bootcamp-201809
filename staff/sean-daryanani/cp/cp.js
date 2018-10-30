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

