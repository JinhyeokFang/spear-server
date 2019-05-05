const db = require('../db')
const router = require('../route')

exports.login = (socket, data) => {
    db.login(data, res => {
        router.loginCallback(data, res)
    })
}

exports.register = (socket, data) => {
    db.register(data, res => {
        router.registerCallback(data, res)
    })
}