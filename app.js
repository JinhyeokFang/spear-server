const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const socketio = require('socket.io')

const config = require('./config').config

const app = express()
const server = app.listen(config.port)
const io = socketio.listen(server)

const game = {}

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
    console.log(socket, ": connected")
    setInterval(() => {
	    socket.emit("message", {"data": "message data"})}, 1500)
    socket.on("msg", () => {
	    throw new Error("it is a error but it isnt a error")})
})