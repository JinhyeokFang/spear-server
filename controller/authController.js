const db = require("../db");
const crypto = require("../modules/crypto");
const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();

exports.login = (socket, data, callback) => {
    db.login(data, res => {
        if (res.message != "login failed") {
	crypto.decrypt({username: data.username}, result => {
            if (connectedUsersInfo.loginUserBySocketId(socket.id, result.username, data.nickname) == undefined)
                callback(res);
            else
                callback({ message: "login failed", err: "the user already logined" });

	});
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

exports.setSkill = (data, callback) => {
    db.setSkill(data, res => {
        callback(res);
    });
};

exports.getSkill = (data, callback) => {
    db.getSkill(data, res => {
        callback(res);
    });
};
