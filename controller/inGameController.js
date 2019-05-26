const connectedUsersInfo = require("../model/connectedUsersInfoInstanceModel").getInstance();

exports.enter = (id, callback) => {
    let result = connectedUsersInfo.enterGameRoomBySocketId(id);
    callback(result.roomid, result.err);
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

exports.getOpponent = id => { //사탄: 아 이건 좀 [이 코드는 connectedUserInfoInstanceModel.js에 넣는게 맞는듯 하다]
    if (connectedUsersInfo.getUserBySocketId(id).roomid == undefined)
        return null;
    if (connectedUsersInfo.getUsersByRoomid(connectedUsersInfo.getUserBySocketId(id).roomid).length != 2)
        return null;

    return connectedUsersInfo.getUsersByRoomid(connectedUsersInfo.getUserBySocketId(id).roomid).find(element => element.id != id);
};

exports.getRoom = id => {
    if (connectedUsersInfo.getUserBySocketId(id).roomid == undefined)
        return null;
    
    return connectedUsersInfo.getRoomByRoomid(connectedUsersInfo.getUserBySocketId(id).roomid);
};