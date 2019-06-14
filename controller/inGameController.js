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

exports.getUsers = id => {
    return connectedUsersInfo.getUsersByRoomid(connectedUsersInfo.getUserBySocketId(id).roomid);
};

exports.getRoom = id => {
    return connectedUsersInfo.getRoomByRoomid(connectedUsersInfo.getUserBySocketId(id).roomid);
};

exports.update = (id, horseBonesPositions, imageCode, direction) => {
    connectedUsersInfo.updateUserInfoBySocketId(horseBonesPositions, imageCode, direction, id);
};

exports.updatePosition = (id, x, y) => {
    connectedUsersInfo.updateUserPositionBySocketId(x, y, id);
};

exports.updateAction = (id, actStatus, actTime) => {
    connectedUsersInfo.updateUserActionBySocketId(actStatus, actTime, id);
};

exports.getOpponent = id => {
    connectedUsersInfo.getOpponentUserBySocketId(id);
};

exports.addDamage = (id, damage) => {
    connectedUsersInfo.addDamage(id, damage);
};

exports.getGameoverRoom = () => {
    return connectedUsersInfo.getGameoverRooms();
};
