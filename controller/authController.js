const db = require("../db")
const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance()
const router = require("../route")

exports.login = (socket, data) => {
    db.login(data, res => {
        router.loginCallback(socket, res)
        if (res.message != "login failed")
            connectedUsersInfo.loginUserBySocketId(socket.id, data.username)
    })
}

exports.register = (socket, data) => {
    db.register(data, res => {
        router.registerCallback(socket, res)
    })
}