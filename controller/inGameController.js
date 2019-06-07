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

exports.update = (id, x, y, horseBonesPositions, actStatus, imageCode) => {
    connectedUsersInfo.updateUserInfoBySocketId(x, y, horseBonesPositions, actStatus, imageCode, id);
};