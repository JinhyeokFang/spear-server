const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const socketio = require('socket.io')

const router = require('./route')
const config = require('./config')

const app = express()
const server = app.listen(config.port)

mongoose.connect(`mongodb://localhost/${config.db.name}`, {
	useNewUrlParser: true   
});

setTimeout(() => router.start(socketio.listen(server)), 1000)