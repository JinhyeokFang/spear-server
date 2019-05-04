const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const socketio = require('socket.io')

const router = require('./route')
const config = require('./config')

const app = express()
const server = app.listen(config.port)
const game = {user: []} //na jung e go chill geo ya

mongoose.connect(`mongodb://localhost/${config.db.name}`, {
	useNewUrlParser: true   
});

router(socketio.listen(server))