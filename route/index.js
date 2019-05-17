const connectionController = require("../controller/connectionController")
const authController = require("../controller/authController")
const inGameController = require("../controller/inGameController")

exports.start = io => {
    io.set("origins", "*:*")
    io.on("connection", socket => {
        connectionController.connect(socket.id)
        socket.on("login", data => authController.login(socket, data))
        socket.on("register", data => authController.register(socket, data))
        socket.on("disconnect", () => connectionController.disconnect(socket.id))
        socket.on("enter", data => inGameController.enter(socket.id, parseInt(data.roomid))),
        socket.on("quit", () => inGameController.quit(socket.id))
        socket.on("move", data => inGameController.move(data.x, data.y, socket.id))
    })
    setInterval(() => {
        io.emit("message", {"data": "message data"})
        console.log(require("../model/connectedUsersInfoInstanceModel").getInstance().userList)
    }, 600)
}

exports.registerCallback = (socket, res) => {
    socket.emit("registerCallback", res)
}
exports.loginCallback = (socket, res) => {
    socket.emit("loginCallback", res)
}