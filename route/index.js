const socketio = require('socket.io')

const connectionController = require('../controller/connectionController')
const authController = require('../controller/authController')

module.exports = io => {
    io.set('origins', '*:*')
    io.on('connection', socket => {
        connectionController.connect()
        socket.on("login", data => authController.login(socket, data))
        socket.on("register", data => authController.register(socket, data))
        socket.on("disconnect", data => connectionController.disconnect())
    })
    setInterval(() => {io.emit("message", {"data": "message data"});}, 600)
}