const fs = require('fs')

const [, , inputPath, outputPath] = process.argv

fs.createReadStream(inputPath).pipe(fs.createWriteStream(outputPath))


fs.readFile(orig, (err, content) => {
    if (err) throw err

    fs.writeFile(dest, content, err => {
        if (err) throw err
    })
})