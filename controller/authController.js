const db = require("../db");
const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();

exports.login = (socket, data, callback) => {
    db.login(data, res => {
        if (res.message != "login failed") {
            if (connectedUsersInfo.loginUserBySocketId(socket.id, data.username, data.nickname) == undefined)
                callback(res);
            else
                callback({ message: "login failed", err: "the user already logined" });
        } else {
            callback(res);
        }
    });
};

exports.register = (socket, data, callback) => {
    db.register(data, res => {
        callback(res);
    });
};