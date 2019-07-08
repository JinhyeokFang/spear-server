const express = require("express");
const socketio = require("socket.io");

const router = require("./route");
const config = require("./config");

const app = express();
const db = require("./db");

db.initialize(config.db);

router(socketio.listen(app.listen(config.port)));