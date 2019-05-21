const connectionController = require("../controller/connectionController");
const authController = require("../controller/authController");
const inGameController = require("../controller/inGameController");

function receiveMessage (socket) {
    socket.on("disconnect", () => connectionController.disconnect(socket.id));

    socket.on("login", data => authController.login(socket, data, res => {
        socket.emit("loginCallback", res);
    }));
    socket.on("register", data => authController.register(socket, data, res => {
        socket.emit("registerCallback", res);
    }));

    socket.on("enter", data => inGameController.enter(socket.id, parseInt(data.roomid), err => {
        if(err != null)
            socket.emit("enterCallback", { message: "enter failed", err});
        else
            socket.emit("enterCallback", { meesage: "enter complete"});
    })),
    socket.on("quit", () => inGameController.quit(socket.id));
    
    socket.on("move", data => inGameController.move(data.x, data.y, socket.id));
}

function sendDataMessage (io, time) {
    setInterval(() => {
        for (var user of connectionController.getUsers()) 
            io.to(user.id).emit("message", user);
    }, time);
}

exports.start = io => {
    io.set("origins", "*:*");
    io.on("connection", socket => {
        connectionController.connect(socket.id);
        receiveMessage(socket);
    });
    sendDataMessage(io, 10);
};