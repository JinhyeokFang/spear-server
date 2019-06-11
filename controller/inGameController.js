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

exports.getUsers = id => {
    return connectedUsersInfo.getUsersByRoomid(connectedUsersInfo.getUserBySocketId(id).roomid);
};

exports.getRoom = id => {
    connectedUsersInfo.getRoomBySocketId(id);
};

exports.update = (id, horseBonesPositions, actStatus, imageCode, actTime, direction) => {
    connectedUsersInfo.updateUserInfoBySocketId(horseBonesPositions, actStatus, imageCode, actTime, direction, id);
};

exports.updatePosition = (id, x, y) => {
    connectedUsersInfo.updateUserPositionBySocketId(x, y, id);
};

exports.getOpponent = id => {
    connectedUsersInfo.getOpponentUserBySocketId(id);
};

exports.addDamage = (id, damage) => {
    connectedUsersInfo.addDamage(id, damage);
}
