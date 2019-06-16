exports.connect = (io, callback) => {
    io.set("origins", "*:*");
    io.on("connection", socket => {
        callback(socket);
    });
};

exports.sendMessageByIO = (io, id, ...params) => {
    io.to(id).emit(...params);
};

exports.sendMessageBySocket = (socket, ...params) => {
    socket.emit(...params);
};

exports.receiveMessageBySocket = (socket, message, callback) => {
    socket.on(message, data => callback(data));
};