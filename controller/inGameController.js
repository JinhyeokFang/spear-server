const db = require("../db");
const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();

exports.enter = (id, callback) => {
    let result = connectedUsersInfo.enterGameRoomBySocketId(id);
    callback(result.roomid, connectedUsersInfo.getUsersByRoomid(result.roomid), result.err);
};

exports.enterCancel = (id, callback) => {
    let result = connectedUsersInfo.enterCancelBySocketId(id);
    callback(result.err);
};

exports.quit = (id, callback) => {
    connectedUsersInfo.quitGameRoomBySocketId(id);
    callback();
};

exports.updateUserInfo = (x, y, act, id) => {
    connectedUsersInfo.updateUserInfoBySocketId(x, y, act, id);
};

exports.skill = (number, id, callback) => {
    callback({number, id});
};

exports.gameover = id => {
    connectedUsersInfo.stopGameByRoomid(connectedUsersInfo.getUserBySocketId(id).roomid);
};

exports.getOpponent = id => {
    connectedUsersInfo.getOpponentUserBySocketId(id);
};

exports.getRoom = id => {
    connectedUsersInfo.getRoomBySocketId(id);
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

exports.move = (id, x, y) => {
    connectedUsersInfo.changeUserPositionBySocketId(id, x, y);
}
