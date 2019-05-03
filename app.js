const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const socketio = require('socket.io')

const config = require('./config').config

const app = express()
const server = app.listen(config.port)
const io = socketio.listen(server)

const game = {user: []}

mongoose.connect(`mongodb://localhost/${config.db.name}`, {
	useNewUrlParser: true
});

const userSchema = mongoose.Schema({
	username: String,
    password: String,
    skillArray: Array
})
const userModel = mongoose.model("user", userSchema)

io.set('origins', '*:*')
io.on('connection', socket => {
    connect(socket)
    socket.on("login", data => login(socket, data))
    socket.on("register", data => register(socket, data))
    socket.on("disconnect", data => disconnect(socket))
})

setInterval(() => {io.emit("message", {"data": "message data"}); console.log(game.user)}, 600)

function connect (socket) {
    game.user.push({id: socket.id})
}

function disconnect (socket) {
    let userIndex = game.user.findIndex(element => element.id == socket.id);
    if (userIndex >= 0)
        game.user.splice(userIndex, 1)
}

function login(socket, data) {
    userModel.where(data).findOne((err, res) => {
        if (res == null) {
            socket.emit("loginCallback", { message: "login failed"} )
        } else {
            socket.emit("loginCallback", { message: "login complete"} )
            game.user[game.user.findIndex(element => element.id == socket.id)].username = data.username
        }
    })
}

function register(socket, data) {
    userModel.where({username: data.username}).findOne(async (err, res) => {
        if (res == null) {
            await new userModel({username: data.username, password: data.password, skillArray: []}).save()
            socket.emit("registerCallback", {
                message: "register complete"
            })
        } else {
            userModel.find((err, res) => {
                socket.emit("registerCallback", { message: "register failed", res} )
            })
        }
    })
}

function update(socket, data) {
    userModel.update({username: data.username}, data, (res, err) => {
        socket.emit("updateCallback", {message: "update complete"})
    })
}