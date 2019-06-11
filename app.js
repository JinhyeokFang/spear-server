const express = require("express");
const logger = require("morgan");
const socketio = require("socket.io");

const router = require("./route");
const config = require("./config");

const app = express();
const db = require("./db");

app.use(logger(config.environment));

db.initialize(config.db.name);

router(socketio.listen(app.listen(config.port)));