const net = require('net')

const server = net.createServer(function(socket) {
    socket.write(getDate())
    socket.end()
})

server.listen(process.argv[2])


function getDate() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minutes = date.getMinutes()

    return `${year}-${month < 10 ? '0' + month : month}-${day<10 ? '0' + day : day} ${hour < 10 ? '0' + hour: hour}:${minutes < 10? '0' + minutes : minutes}\n`

}