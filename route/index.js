const connectionController = require('../controller/connectionController')
const authController = require('../controller/authController')
const inGameController = require('../controller/inGameController')

exports.start = io => {
    io.set('origins', '*:*')
    io.on('connection', socket => {
        connectionController.connect()
        socket.on("login", data => authController.login(socket, data))
        socket.on("register", data => authController.register(socket, data))
        socket.on("disconnect", data => connectionController.disconnect())
    })
    setInterval(() => {io.emit("message", {"data": "message data"});}, 600)
}

exports.registerCallback = (socket, res) => {
    socket.emit("registerCallback", res)
}
exports.loginCallback = (socket, res) => {
    socket.emit("loginCallback", res)
}