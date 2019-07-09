const socketio = require("socket.io");

const router = require("./route");
const config = require("./config"); 
const db = require("./db");

db.initialize(config.db);

router(socketio.listen(config.port));