const connectionController = require("../controller/connectionController");
const authController = require("../controller/authController");
const inGameController = require("../controller/inGameController");

function receiveMessage (io, socket) {
    socket.on("disconnect", () => connectionController.disconnect(socket.id, opponentUser => {
        sendMessageByIO(io, opponentUser.id, "gameover", {result: "the opponent user quit"});
    }));

    socket.on("login", data => authController.login(socket, data, res => {
        sendMessageBySocket(socket, "loginCallback", res);
    }));
    socket.on("register", data => authController.register(socket, data, res => {
        sendMessageBySocket(socket, "registerCallback", res);
    }));

    socket.on("enter", () => inGameController.enter(socket.id, (roomid, users, err) => {
        if(err != null)
            sendMessageBySocket(socket, "enterCallback", { message: "enter failed", err});
        else
            sendMessageBySocket(socket, "enterCallback", { message: "enter complete", roomid, users});

        if(users.length >= 2) {
            users.forEach(user => sendMessageByIO(io, user.id, "gamestart"));
        }
    })),
    socket.on("enterCancel", () => inGameController.enterCancel(socket.id, err => {
        if(err != null)
            sendMessageBySocket(socket, "enterCancelCallback", { message: "enterCancel failed", err});
        else
            sendMessageBySocket(socket, "enterCancelCallback", { message: "enterCancel complete"});
    }));
    socket.on("quit", () => inGameController.quit(socket.id));
    socket.on("gameover", () => inGameController.gameover(socket.id));
    socket.on("skill", data => inGameController.skill(data.number, socket.id, () => {
    
    }));
    socket.on("setSkill", data => inGameController.setSkill(data));
    socket.on("getSkill", data => inGameController.getSkill(data));
    
    socket.on("updateUserInfo", data => inGameController.updatePosition(data.x, data.y, data.act));
}

function sendDataMessage (io, time) {
    setInterval(() => {
        for (var user of connectionController.getUsers()) 
            sendMessageByIO(io, user.id, "message", {user, opponent: inGameController.getOpponent(user.id), room: inGameController.getRoom(user.id)});
    }, time);
}

function sendMessageByIO (io, id, ...params) {
    io.to(id).emit(...params);
}

function sendMessageBySocket (socket, ...params) {
    socket.emit(...params);
}

module.exports = io => {
    io.set("origins", "*:*");
    io.on("connection", socket => {
        connectionController.connect(socket.id);
        receiveMessage(io, socket);
    });
    sendDataMessage(io, 60);
};