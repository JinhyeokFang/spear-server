const connectionController = require("../controller/connectionController");
const authController = require("../controller/authController");
const inGameController = require("../controller/inGameController");

function receiveMessage (socket) {
    socket.on("disconnect", () => connectionController.disconnect(socket.id));

    socket.on("login", data => authController.login(socket, data, res => {
        sendMessageBySocket(socket, "loginCallback", res);
    }));
    socket.on("register", data => authController.register(socket, data, res => {
        sendMessageBySocket(socket, "registerCallback", res);
    }));

    socket.on("enter", () => inGameController.enter(socket.id, (roomid, err) => {
        if(err != null)
            sendMessageBySocket(socket, "enterCallback", { message: "enter failed", err});
        else
            sendMessageBySocket(socket, "enterCallback", { message: "enter complete", roomid});
    })),
    socket.on("quit", () => inGameController.quit(socket.id));
    
    socket.on("move", data => inGameController.move(data.x, data.y, socket.id));
    socket.on("skill", data => inGameController.skill(data.number, socket.id, result => {
        console.log(result);
    }));
    // socket.on("kill", data => inGameController.kill(data.target, socket.id, res => {

    // }))
}

function sendDataMessage (io, time) {
    setInterval(() => {
        for (var user of connectionController.getUsers()) 
            sendMessageByIO(io, user.id, "message", {user, userList: connectionController.getUsers()});
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
        receiveMessage(socket);
    });
    sendDataMessage(io, 100);
};