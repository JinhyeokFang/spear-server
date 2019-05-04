const db = require('../db')

exports.login = (socket, data) => {
    db.login(data, res => {
        socket.emit("loginCallback", res) //najung e go cheo ya jing
    })
}

exports.register = (socket, data) => {
    db.register(data, res => {
        socket.emit("registerCallback", res) //2geo do najung e
    })
}