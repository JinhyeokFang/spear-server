const db = require("../db");
const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();

exports.login = (socket, data, callback) => {
    db.login(data, res => {
        callback(res);
        if (res.message != "login failed")
            connectedUsersInfo.loginUserBySocketId(socket.id, data.username);
    });
};

exports.register = (socket, data, callback) => {
    db.register(data, res => {
        callback(res);
    });
};