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
    if (connectedUsersInfo.getUserBySocketId(id).roomid == undefined)
        return;
    connectedUsersInfo.getUsersByRoomid(connectedUsersInfo.getUserBySocketId(id).roomid);
};

exports.getRoom = id => {
    connectedUsersInfo.getRoomBySocketId(id);
};

exports.update = (id, x, y, horseBonesPositions, actStatus, imageCode, actTime, direction) => {
    connectedUsersInfo.updateUserInfoBySocketId(x, y, horseBonesPositions, actStatus, imageCode, actTime, direction, id);
};

exports.getOpponent = id => {
    connectedUsersInfo.getOpponentUserBySocketId(id);
}